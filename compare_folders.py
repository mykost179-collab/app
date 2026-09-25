import os

base_dir = r"C:/Users/aidan/aplikasi/my_date"
update_dir = r"C:/Users/aidan/aplikasi/my_date/Update"

def get_rel_files(root):
    res = {}
    for r, dirs, files in os.walk(root):
        if "venv" in r or ".git" in r or "node_modules" in r:
            continue
        for f in files:
            full = os.path.join(r, f)
            rel = os.path.relpath(full, root)
            res[rel] = full
    return res

main_files = get_rel_files(base_dir)
# remove any files starting with Update\ from main_files
main_files = {k: v for k, v in main_files.items() if not k.startswith("Update")}

update_files = get_rel_files(update_dir)

print("=== Comparing main project vs Update folder ===")
modified = []
new_in_update = []
missing_in_update = []

for rel, update_full in update_files.items():
    main_full = os.path.join(base_dir, rel)
    if not os.path.exists(main_full):
        new_in_update.append(rel)
    else:
        with open(update_full, "rb") as f1, open(main_full, "rb") as f2:
            if f1.read() != f2.read():
                modified.append(rel)

for rel in main_files:
    if rel not in update_files:
        missing_in_update.append(rel)

print(f"New in Update: {len(new_in_update)}")
for f in new_in_update:
    print(f"  [NEW] {f}")

print(f"Modified (different from main): {len(modified)}")
for f in modified:
    print(f"  [MODIFIED] {f}")

print(f"Missing in Update: {len(missing_in_update)}")
for f in missing_in_update:
    print(f"  [MISSING] {f}")
