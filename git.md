
## Modifying Git Commit history

Use this modern tool `git-filter-repo` to rewrite history

```sh
# removes the file from history
git filter-repo --invert-paths --path big_file.iso
```

Need to force-push after making such changes.


## Git LFS

LFS can be used to store large files. It will still take up the same space and will be hosted in GitHub only, but there are some minor advantages.

Install in Mac-OS using `brew install git-lfs` or Linux `sudo apt-get install git-lfs`

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



`git-lfs` can also move existing files that were committed into the history.

```sh
# Shows top 10 biggest files
git lfs migrate info --everything --top=10

# Move the existing large files into lfs.
git lfs migrate import --include="big_file.iso" --everything
# The --everything flag tells Git LFS to apply the migration to all branches and tags in your repository
```

Note: `git lfs pull` is also needed when we checkout a branch that has lfs-tracked files because by default it is just a pointer.

