if [ -d "/home/coder/project/workspace/MiniCart/src/tests/" ]
    then
        rm -r /home/coder/project/workspace/MiniCart/src/tests;
fi
cp -r /home/coder/project/workspace/react/tests /home/coder/project/workspace/MiniCart/src/;
cd /home/coder/project/workspace/MiniCart/;
source /usr/local/nvm/nvm.sh
nvm use 16
export CI=true;
if [ -d "/home/coder/project/workspace/MiniCart/node_modules" ]; then
    cd /home/coder/project/workspace/MiniCart/
    npx react-scripts test --verbose --testPathPattern=src/tests 2>&1;
else
    cd /home/coder/project/workspace/MiniCart/
    yes | npm install
    npx react-scripts test --verbose --testPathPattern=src/tests 2>&1;
fi
