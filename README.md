# 🚀 Quick Start

✅ Clone or fork `vestingVault`:

```sh
git clone https://github.com/menezesphill/vestingVault.git
```

💿 Install dependencies with yarn:

```sh
cd vestingVault
yarn install
```

💿 Install truffle for all users:

```sh
npm install -g truffle
```

# 🧆 Navigating Truffle

✅ In case of making any modifications within .sol files, you can run:

```sh
truffle compile
```

To update build artifacts;

✅ Check if the test checklist passes by running:

```sh
truffle test
```

Testing cases are not as extensive as we would like. if you want to contribute creating new test cases, please do so.

✅ Deploying contracts to testnet:

There is a portion of the community that might be tempted to use [Remix](https://remix.ethereum.org/) but we are not taking shortcuts. We would like to use a more "Orthodox" approach, if you will. For simplicity we will use Ganache GUI, which can be downloaded here: https://trufflesuite.com/ganache/

Upon starting Ganache, go ahead and `QUICKSTART` a new network, you will see a window that looks like this:

