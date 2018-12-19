# Setup for Ubuntu 18.04

 - Git
 - Install Docker
 - Install WebStorm
 - Install Node.js, <i>npm</i> and <i>n</i>
 - Setup WebStorm
 - Install DataGrip

### Git

Clone MaSo repository
```bash
git clone https://github.com/Matematicka-Soutez/Web.git
```

###  Docker
Please check [this link](https://www.bretfisher.com/installdocker/) on how to install docker on your system. 

Or if feeling lucky just try:

```bash
sudo snap install docker
```

Alternatives (don't use unless):
 - Official Docker CE installation guide (https://docs.docker.com/install/linux/docker-ce/ubuntu/#upgrade-docker-ce)
 - In-built package agent:
   ```bash
   sudo apt-get install docker
   ```
   If docker-compose not included:
   ```bash
   sudo apt-get install docker-compose
   ```
 - Download with curl + add docker-compose:
   ```bash
   sudo curl -sSL https://get.docker.com/ | sh
    ```
    ```bash
    sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```

### WebStorm

You can install Webstorm through Ubuntu Software app or download gzip from web (https://www.jetbrains.com/webstorm/download/download-thanks.html) and then follow installation guide.

### Node.js, <i>npm</i> and <i>n</i>

Get Node.js:
```bash
sudo apt-get install node.js
```
Check if <i>npm</i> is included:
```bash
npm -v
```
- If it's not, install it:
    ```bash
    sudo apt-get install npm
    ```
Then install <i>n</i> (version manager) using <i>npm</i>:
```bash
sudo npm -g i n
```
In ```package.json``` look up version of Node.js and change your version to that, <i>npm</i> version should change as well:
```bash
n [version_number]
```

Install libraries (<b>Run in /MaSo directory!</b>):
```bash
npm i
```

### Setup WebStorm

Get from another team member ```.idea/``` directory and add it into ```MaSo/``` project

### Install DataGrip

You can get DataGrip easily from Ubuntu Software
