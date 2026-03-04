# Foundry F23

Foundry/Solidity course projects. This repository uses `cast wallet` to manage private keys securely, without exposing secrets in `.env` files.

## Managing private keys with cast wallet

Instead of storing the private key in a `.env` file (which is risky and easy to leak via git), Foundry provides an encrypted keystore via `cast wallet`.

### 1. Import the private key

The command below prompts for the private key and a password to encrypt it. The key is saved locally under the specified name (`defaultKey`):

```bash
cast wallet import defaultKey --interactive
```

The process:
1. Paste the private key when prompted
2. Set a password to protect the keystore
3. The key is saved at `~/.foundry/keystores/`

### 2. Verify saved keys

```bash
cast wallet list
```

### 3. Deploy using the saved key

With `--rpc-url` pointing to a network (local or public), Foundry needs to sign real transactions and will prompt for the keystore password:

```bash
# Local network (Anvil)
forge script script/DeploySimpleStorage.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --account defaultKey \
  --broadcast \
  -vvvv
```

The `--account` flag references the saved keystore name.
