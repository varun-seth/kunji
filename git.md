
## Git LFS

LFS can be used to store large files. It will still take up the same space, and will be hosted in github only, but there are some minor advantages.

Install in mac os using `brew install git-lfs` or linux `sudo apt-get install git-lfs`

```sh
# install lfs in current repo, It will print "Updated Git hooks"
git lfs install

# track files or folders
git lfs track "big_file.iso"
git lfs track "bin/**/*"
# Note: "bin/**/*" will recursively find all files. To only put top level files, use "bin/*"

# Above will add some new lines in the git attributes which must also be commited
git add .gitattributes
git add big_file.iso
git add bin/
git commit -m "New files in LFS"

# Try listing the files
git lfs ls-files
```

### Migrating existing Commits

Use this modern tool `git-filter-repo` to rewrite history as if the big files were never added in git.

```sh
# removes the file from history
git filter-repo --invert-paths --path big_file.iso
```

Need to force-push.

### Find large files

```sh
# Shows top 10 biggest files
git lfs migrate info --everything --top=10
```
