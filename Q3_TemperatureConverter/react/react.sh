if [ -d "/home/coder/project/workspace/TemperatureConverter/src/tests/" ]
    then
        rm -r /home/coder/project/workspace/TemperatureConverter/src/tests;
fi
cp -r /home/coder/project/workspace/react/tests /home/coder/project/workspace/TemperatureConverter/src/;
cd /home/coder/project/workspace/TemperatureConverter/;
source /usr/local/nvm/nvm.sh
nvm use 16
export CI=true;
if [ -d "/home/coder/project/workspace/TemperatureConverter/node_modules" ]; then
    cd /home/coder/project/workspace/TemperatureConverter/
    npx react-scripts test --verbose --testPathPattern=src/tests 2>&1;
else
    cd /home/coder/project/workspace/TemperatureConverter/
    yes | npm install
    npx react-scripts test --verbose --testPathPattern=src/tests 2>&1;
fi
