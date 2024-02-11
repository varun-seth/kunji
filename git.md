# Git

Git is a Distributed Version Control System (DVCS). 


## Config

The following are required only once to configure the user details, used for each commit.

```sh
# Put a friendly name
git config --global user.name "Name Here"

# use the private email provided by github settings to prevent spam.
git config --global user.email <youremail@example.com>
```



## Init
Following are the initial commands for git.
```sh
# initializes empty repo
git init

# first commit (deliberately kept empty)
git commit -m "Initial commit" --allow-empty

# adds an origin
git remote add origin https://github.com/username/project.git

# pushe to cloud
git push -u origin main
```


## making commits

```sh
# add all changes to staging
git add .
# or add specific changes one by one
git add README.md

# look at status
git status

# create the commit
git commit -m "message"

# push current brnach.
git push
```

## Reverting
```sh
# This can reset the last made commit, moving commited changes to staging.
git reset HEAD~
```

Another way is to revert.

```sh
# this creates a new commit that reverses the changes done by an older commit, mentioned by its commit hash
git revert <commit-hash>
```

## Branches

```sh
# list all the branches, and also a star appears in front of the current branch
git branch

# -b option is used to create a new branch with this given name, and then checkout
git checkout -b branchname
# if already exists, use this instead
git checkout branchname
```
