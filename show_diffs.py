import difflib

base_dir = r"C:/Users/aidan/aplikasi/my_date"
update_dir = r"C:/Users/aidan/aplikasi/my_date/Update"

modified_files = [
    r"backend/requirements.txt",
    r"frontend/package.json",
    r"frontend/src/App.js",
    r"frontend/src/components/AddSheet.jsx",
    r"memory/PRD.md"
]

for rel in modified_files:
    p1 = f"{update_dir}/{rel}"
    p2 = f"{base_dir}/{rel}"
    print(f"\n================ DIFF FOR {rel} ================")
    with open(p1, "r", encoding="utf-8", errors="ignore") as f1, open(p2, "r", encoding="utf-8", errors="ignore") as f2:
        c1 = f1.readlines()
        c2 = f2.readlines()
        diff = difflib.unified_diff(c1, c2, fromfile=f"Update/{rel}", tofile=f"main/{rel}")
        for line in diff:
            print(line, end="")
