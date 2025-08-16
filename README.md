# Paisabad: a Personal Finance Tracker

# Description

Paisabad is a user-friendly personal finance tracking app built with React Native and Expo, designed to help you manage your finances effortlessly. Whether you're tracking your cash flow, splitting expenses with friends, or monitoring your net worth, Paisabad provides a sleek and intuitive interface to keep your financial life organized.
Key Features

Dashboard: View real-time metrics like Available Cash, Temporary Holdings, Real Savings, and Net Worth at a glance.
Accounts Management: Track multiple accounts (e.g., bank, PayPal, or cash owed to friends) with pre-populated or custom entries.
Transaction Tracking: Log transactions between accounts, including amounts and ownership details, with seamless updates to your financial overview.
Friends Tracking: Manage shared expenses and balances with friends, making it easy to settle up.
Dark Mode: Enjoy a visually appealing dark-themed interface for comfortable use in any lighting.
Local Storage: Securely store financial data on-device using AsyncStorage, with optional iCloud sync (in native builds).
Cross-Platform: Built with React Native, supporting iOS and Android with a single codebase.

# Technology Stack

Framework: React Native with Expo for rapid development and cross-platform support.
Styling: NativeWind (Tailwind CSS for React Native) for responsive, modern UI design.
State Management: Zustand for efficient, scalable state handling.
Navigation: Expo Router for smooth, file-based navigation.
Dependencies: Includes @tanstack/react-query for data fetching, expo-image-picker, expo-location, and more for enhanced functionality.
Package Manager: Bun for fast dependency management and builds.

# Getting Started
## Prerequisites

Bun: Install Bun for package management:curl -fsSL https://bun.sh/install | bash


Expo Go: Install the Expo Go app on your iOS or Android device from the App Store or Google Play.
Xcode (for iOS builds): Install Xcode 16+ from the Mac App Store.
Apple Developer Account: Free account for internal distribution, or paid ($99/year) for App Store submission.

## Installation

Clone the Repository:
git clone https://github.com/naiyarmuslim/Paisabad.git
cd Paisabad


## Install Dependencies:
bun install


## Run the App:

For development with Expo Go:bunx rork start -p ledc8jfibfvkang7hjn82 --tunnel

Scan the QR code with the Expo Go app on your iPhone or Android device.
For a standalone build:bun add -g @expo/cli
eas build --platform ios --profile development




## Configuration:

Ensure app.json has a unique bundleIdentifier (e.g., com.yourname.Paisabad).
Update API URLs in constants/api.ts if using a remote server.



## Installation on Devices

Expo Go: Run the app instantly by scanning the QR code.
Standalone App: Build an .ipa file with EAS Build and sideload via Xcode or Finder. Requires Developer Mode on iOS:
Enable Developer Mode: Settings > Privacy & Security > Developer Mode.
Trust the developer: Settings > General > VPN & Device Management.


Sharing: Distribute to testers via TestFlight or ad-hoc .ipa files (up to 100 devices with a free Apple Developer account).

Contributing
Contributions are welcome! Please follow these steps:

## Fork the repository.
Create a feature branch:git checkout -b feature/your-feature


Commit changes:git commit -m 'Add your feature'


Push to the branch:git push origin feature/your-feature


## Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or feedback, reach out to gullnaiyar@gmail.com.com or open an issue on GitHub.
Created Naiyar Muslim
