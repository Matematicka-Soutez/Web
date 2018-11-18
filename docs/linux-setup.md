# Setup for Ubuntu 18.04

 - Install Docker
 - Install WebStorm
 - Install Node.js, <i>npm</i> and <i>n</i>
 - Setup WebStorm

###  Docker
You can install Docker by various ways but snap is reliable:

```bash
sudo snap install docker
```

Alternatives:
 - Official Docker CE installation guide (https://docs.docker.com/install/linux/docker-ce/ubuntu/#upgrade-docker-ce)
 - In-built package agent:
   ```bash
   sudo apt-get install docker
   ```
   If docker-compose not included:
   ```
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
Install libraries:
```bash
npm i
```
Then install <i>n</i> (version manager) using <i>npm</i>:
```bash
sudo npm -g i n
```
In ```package.json``` look up version of Node.js and change your version to that, <i>npm</i> version should change as well:
```bash
n [version_number]
```
### Setup WebStorm

Get from another team member ```.idea/``` directory and add it into ```MaSo/``` project


