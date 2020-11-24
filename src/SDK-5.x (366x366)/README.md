# Fitbit Sense App with User Engagement Analytics

# Requirements
* npm
* Visual Studio Building Tools

# Setup 
1. Install [Visual Studio Building Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=15) (incl. Visual C++ build tools)
2. Install [npm](https://www.npmjs.com/get-npm) 

# Running with Fitbit CLI
1. Enter the project folder (here src\SDK-5.x (366x366))
2. Run ```npm add --dev @fitbit/sdk```
3. Run ```npm add --dev @fitbit/sdk-cli```
4. Run ```npx fitbit-build generate-appid```
5. Run ```npx fitbit-build```
6. Run ```npx fitbit``` to login with Fitbit online
7. In the Fitbit CLI, run ```install``` to install your custom app to your Fitbit or Fitbit OS simulator

That's it! The app is running!

# Possible Issues
* ```ERROR: The install of visualstudio2017-workload-vctools was NOT successful```: 
Verify that you have Visual Studio Building Tools installed (if necessary, install Visual C++ build tools manually), then run ```choco upgrade -y visualstudio2017-workload-vctools```
* Inability to install app with message ``` You must be enrolled as a developer to use this application```. Go to [Fitbit Studio](https://studio.fitbit.com/) and agree to the Terms of Service. 