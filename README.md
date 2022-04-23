# 🧭 Table of contents

- [🧭 Table of contents](#-table-of-contents)
- [🚀 Quick Start](#-quick-start)
- [🪙 Vesting Vault](#-vesting-vault)
- - [Add Token Grant](#add-token-grant)
  - [Revoke Token Grant](#revoke-token-grant)
   - [Claim Vested Tokens](#claim-vested-tokens)
- [🧆 Navigating Truffle](#-navigating-truffle)

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
# 🪙 Vesting Vault

The vesting vault follows a `Graded Vesting` schedule that gradually grants ownership of a determined `ERC20 Token` to a grantee. For simplicity, each VestingVault instance can only grant one `ERC20 Token` that is defined on deployment as an argument to the Smart Constract `constructor`:

```jsx
   ERC20 public token;
   
   constructor(ERC20 _token) {
        require(address(_token) != address(0));
        token = _token;
    }
```

### Add Token Grant

There are four important variables that defines how the vesting unlocking will play out: Grantee address, Grant amount, Vesting Cliff and Vesting Duration. These are the arguments used to create a new grant:

```jsx
   function addTokenGrant(
        address _recipient,
        uint256 _amount,
        uint16 _vestingDurationInDays,
        uint16 _vestingCliffInDays    
    )
```

The arguments  `address _recipient`, `uint256 _amount` and `_vestingDurationInDays` are pretty straight forward. However `_vestingCliffInDays` can cause some confusion. Lets have a look at the picture below:

<p align="center">
  <img src="https://github.com/menezesphill/vestingVault/blob/master/img/vesting-expl.png?raw=true" alt="Vesting Curve"/>
</p>

The Cliff defines when the grant starts to unlock, in our case, this cliff is given in days. `_vestingCliffInDays` can be Zero, in this case, vesting starts when the grant is created and there is no cooldown time before grantees can start claiming.

### Revoke Token Grant

If the vesting authority (contract owner) decides to cancel vesting before `_vestingDurationInDays` ends. The grant can be revoked by using:

```jsx
function revokeTokenGrant(address _recipient)
```

The remaining locked `ERC20 Tokens` are returned to the contract owner and any unlocked token is sent to `address _recipient`. 

### Claim Vested Tokens

If the address calling this method (i.e. `msg.sender` ) is a grantee recipient, unlocked balanced is sent to `msg.sender`.

```jsx
function claimVestedToken()
```
 

# 🧆 Navigating Truffle

✅ In case of making any changes to .sol files, you can run:

```sh
truffle compile
```

To update build artifacts;

✅ Check if the test checklist passes by running:

```sh
truffle test
```

Testing cases are not as extensive as we would like. if you want to contribute creating new test cases, please do so.

✅ Deploying contracts to local testnet:

There is a portion of the community that might be tempted to use [Remix](https://remix.ethereum.org/) but we are not taking shortcuts. We would like to use a more "Orthodox" approach, if you will. For simplicity we will use Ganache GUI, which can be downloaded here: https://trufflesuite.com/ganache/

Upon starting Ganache, go ahead and `QUICKSTART` a new network, you will see a window that looks like this:

![](https://github.com/menezesphill/vestingVault/blob/master/img/ganache.png)

Make sure to change `NETWORK ID` and `RPC SERVER` info in your `truffle-config.js` file:

```jsx
  networks: {
     development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Standard Ethereum port
      network_id: "5777",       // Any network
     },
   }
```

⚠️ ATENTION: If you are using a `WSL instance`, you might need to configure the correct network on Ganache in order to deploy to the testnet.

When you are good to go, you can go ahead and:

```sh
truffle migrate
```

Now you can also run the tests on your local testnet:

```sh
truffle test --network development
```

And interact with your Smart Contracts from the console:

```sh
truffle console
```
