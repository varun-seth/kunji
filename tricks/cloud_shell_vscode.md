
For free, Google CloudShell gives 5 GB persistent storage space and 50 hours of Computation in a Quad Core machine with 16GB RAM.

## Using Google CloudShell in Visual Studio Code

Google GCP account gives access to a virtual machine for free. This is accessible in-browser on the link https://shell.cloud.google.com (it opens a VS-Code-like editor in the browser). But we take a step further and open this VM using our local instance of VS Code.

Steps:
- Install Google cloud CLI in your system. [Refer](https://cloud.google.com/sdk/docs/install)
  - Recommend in MacOS: `brew install --cask google-cloud-sdk`
- Login.
  - Run `gcloud auth login`
  - A URL will appear in the format `https://accounts.google.com/o/oauth2/auth?...`. Open this URL in a browser (it is opened automatically)
  - A dialog box with some permissions. After reading it carefully hit the "Allow" button at the bottom.
- Open VSCode, search for "Remote - SSH" in the Extensions pane, open the first result (by Microsoft) and install it.
- Add the following to your SSH Config file. In my system, it was located at `~/.ssh/config`
  
```config
Host CS
  CheckHostIP no
  Port 6000
  IdentityFile ~/.ssh/google_compute_engine
  HashKnownHosts no
  IdentitiesOnly no
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
  ProxyCommand nc $(gcloud cloud-shell ssh --dry-run --authorize-session | grep -Eo '(\d+\.\d+\.\d+\.\d+)') %p
  ProxyUseFdpass no
  User your_user_name
```
  Replace the `your_user_name` with your google account username. Use underscores instead of dots. For example, if your username is `example.name123@gmail.com` then you need to use `example_name123`
  You can modify the Host "CS", which is a friendly name for this SSH configuration.
- Try connecting to the Cloud Shell (CS) machine using SSH by running `ssh CS`. Following is a sample output.
```
~$ ssh CS
WARNING: The private SSH key file for gcloud does not exist.
WARNING: The public SSH key file for gcloud does not exist.
WARNING: You do not have an SSH key for gcloud.
WARNING: SSH keygen will be executed to generate a key.
Pushing your public key to Cloud Shell...
.......done.
Waiting for your Cloud Shell machine to start...
..................done.
Warning: Permanently added '[cs]:6000' (RSA) to the list of known hosts.
Welcome to Cloud Shell! Type "help" to get started.
To set your Cloud Platform project in this session use “gcloud config set project [PROJECT_ID]”
example_name123@cloudshell:~$ 
```
  Note that the prompt shows `example_name123@cloudshell` where `example_name123` is your google account username (after replacing dots with underscores)
- Click on "Open Remote window" on the bottom left corner in VS Code (the green button) -> Connect to Host -> CS, this should launch a new VS Code window connected with the cloud shell.
- Run `htop` and confirm that this virtual machine has 4 CPUs and 16G memory.


Note: Google Cloud Shell comes with a usage quota of 50 hours per week (at the time of writing this).

Note: If it does not work, try "retry" button a couple of times.
