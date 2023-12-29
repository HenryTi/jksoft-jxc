echo 'push jxc js to jiekeapp.cn'
scp -r dist/index.html root@jiekeapp.cn:/tonwa/jxc/dist/
scp -r dist/assets/index-*.js root@jiekeapp.cn:/tonwa/jxc/dist/assets/
scp -r dist/assets/index-*.css root@jiekeapp.cn:/tonwa/jxc/dist/assets/
