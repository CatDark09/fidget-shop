#!/usr/bin/env python3
"""Convert a Bambu Studio multi-file 3MF to a binary STL.

The 3MF format is a ZIP of XML files. Bambu Studio splits meshes into
external `3D/Objects/object_N.model` files referenced via the `p:path`
production extension. Three.js r128's `3MFLoader.js` cannot resolve those
external references, so we flatten the mesh into a STL the existing
`STLLoader` can read.
"""
from __future__ import annotations

import argparse
import struct
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

CORE_NS = "{http://schemas.microsoft.com/3dmanufacturing/core/2015/02}"
PROD_NS = "{http://schemas.microsoft.com/3dmanufacturing/production/2015/06}"


def _parse_model(zf: zipfile.ZipFile, path: str):
    with zf.open(path) as fp:
        return ET.parse(fp).getroot()


def _collect_meshes(zf: zipfile.ZipFile, root: ET.Element, transforms_by_object: dict, all_objects: dict):
    """Walk objects, recording mesh objects and component-only objects."""
    resources = root.find(f"{CORE_NS}resources")
    if resources is None:
        return
    for obj in resources.findall(f"{CORE_NS}object"):
        obj_id = obj.get("id")
        mesh = obj.find(f"{CORE_NS}mesh")
        if mesh is not None:
            all_objects[obj_id] = ("mesh", mesh)
        else:
            comps = obj.find(f"{CORE_NS}components")
            if comps is not None:
                all_objects[obj_id] = ("components", list(comps))


def _read_mesh(mesh: ET.Element):
    vertices_el = mesh.find(f"{CORE_NS}vertices")
    triangles_el = mesh.find(f"{CORE_NS}triangles")
    verts = []
    for v in vertices_el.findall(f"{CORE_NS}vertex"):
        verts.append((float(v.get("x")), float(v.get("y")), float(v.get("z"))))
    tris = []
    for t in triangles_el.findall(f"{CORE_NS}triangle"):
        tris.append((int(t.get("v1")), int(t.get("v2")), int(t.get("v3"))))
    return verts, tris


def _load_external_model(zf: zipfile.ZipFile, p_path: str):
    """Load an external part referenced via `p:path`."""
    name = p_path.lstrip("/")
    return _parse_model(zf, name)


def _resolve_components(zf: zipfile.ZipFile, components, all_objects, root_model):
    """For each component, return its (vertices, triangles) — recursively flattens."""
    out = []
    for comp in components:
        p_path = comp.get(f"{PROD_NS}path")
        objectid = comp.get("objectid")
        if p_path:
            ext_root = _load_external_model(zf, p_path)
            ext_objs: dict = {}
            _collect_meshes(zf, ext_root, {}, ext_objs)
            if objectid in ext_objs:
                kind, payload = ext_objs[objectid]
                if kind == "mesh":
                    out.append(_read_mesh(payload))
                else:
                    out.extend(_resolve_components(zf, payload, ext_objs, ext_root))
            else:
                # fall back to first mesh in external file
                for kid, (kind, payload) in ext_objs.items():
                    if kind == "mesh":
                        out.append(_read_mesh(payload))
                        break
        else:
            if objectid in all_objects:
                kind, payload = all_objects[objectid]
                if kind == "mesh":
                    out.append(_read_mesh(payload))
                else:
                    out.extend(_resolve_components(zf, payload, all_objects, root_model))
    return out


def convert(src: Path, dst: Path) -> None:
    with zipfile.ZipFile(src) as zf:
        root_model = _parse_model(zf, "3D/3dmodel.model")
        all_objects: dict = {}
        _collect_meshes(zf, root_model, {}, all_objects)

        meshes: list = []
        build = root_model.find(f"{CORE_NS}build")
        if build is None:
            raise RuntimeError("No <build> element in 3dmodel.model")
        for item in build.findall(f"{CORE_NS}item"):
            objectid = item.get("objectid")
            if objectid not in all_objects:
                raise RuntimeError(f"Build references missing object id={objectid}")
            kind, payload = all_objects[objectid]
            if kind == "mesh":
                meshes.append(_read_mesh(payload))
            else:
                meshes.extend(_resolve_components(zf, payload, all_objects, root_model))

    if not meshes:
        raise RuntimeError("No meshes resolved from 3MF")

    # Merge meshes and write binary STL
    all_tris = []
    for verts, tris in meshes:
        for v1, v2, v3 in tris:
            p1 = verts[v1]
            p2 = verts[v2]
            p3 = verts[v3]
            # face normal (right-hand rule)
            ux, uy, uz = p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]
            vx, vy, vz = p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]
            nx = uy * vz - uz * vy
            ny = uz * vx - ux * vz
            nz = ux * vy - uy * vx
            length = (nx * nx + ny * ny + nz * nz) ** 0.5 or 1.0
            nx /= length
            ny /= length
            nz /= length
            all_tris.append((nx, ny, nz, p1, p2, p3))

    with dst.open("wb") as fp:
        # 80-byte header
        fp.write(b"Generated by convert_3mf_to_stl.py".ljust(80, b"\0"))
        fp.write(struct.pack("<I", len(all_tris)))
        for nx, ny, nz, p1, p2, p3 in all_tris:
            fp.write(
                struct.pack(
                    "<12fH",
                    nx,
                    ny,
                    nz,
                    p1[0],
                    p1[1],
                    p1[2],
                    p2[0],
                    p2[1],
                    p2[2],
                    p3[0],
                    p3[1],
                    p3[2],
                    0,
                )
            )
    print(f"Wrote {len(all_tris)} triangles to {dst}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src", type=Path)
    ap.add_argument("dst", type=Path)
    args = ap.parse_args()
    convert(args.src, args.dst)


if __name__ == "__main__":
    main()
