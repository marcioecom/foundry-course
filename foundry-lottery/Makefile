-include .env

.PHONY: all test clean deploy deploy-sepolia fund help install snapshot format anvil build createSubscription addConsumer fundSubscription

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

help:
	@echo "Usage:"
	@echo "  make install             - Install dependencies"
	@echo "  make build               - Build the project"
	@echo "  make test                - Run tests"
	@echo "  make snapshot            - Create gas snapshot"
	@echo "  make format              - Format code"
	@echo "  make anvil               - Start local Anvil chain"
	@echo "  make deploy              - Deploy to local Anvil"
	@echo "  make deploy-sepolia      - Deploy to Sepolia testnet"
	@echo "  make createSubscription  - Create VRF subscription"
	@echo "  make addConsumer         - Add consumer to VRF subscription"
	@echo "  make fundSubscription    - Fund VRF subscription"

all: clean install build

clean:; forge clean

install:; forge add cyfrin/foundry-devops@0.4.0 && forge add smartcontractkit/chainlink-evm@v0.3.3 && forge add transmissions11/solmate

build:; forge build

test:; forge test

snapshot:; forge snapshot

format:; forge fmt

anvil:; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

# Verification flags - only added when ETHERSCAN_API_KEY is set
VERIFY_ARGS :=
ifdef ETHERSCAN_API_KEY
	VERIFY_ARGS := --verify --etherscan-api-key $(ETHERSCAN_API_KEY)
endif

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast $(VERIFY_ARGS) -vvvv
endif

deploy:
	@forge script script/DeployRaffle.s.sol:DeployRaffle $(NETWORK_ARGS)

deploy-sepolia:
	@forge script script/DeployRaffle.s.sol:DeployRaffle --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast $(VERIFY_ARGS) -vvvv

createSubscription:
	@forge script script/Interactions.s.sol:CreateSubscription $(NETWORK_ARGS)

addConsumer:
	@forge script script/Interactions.s.sol:AddConsumer $(NETWORK_ARGS)

fundSubscription:
	@forge script script/Interactions.s.sol:FundSubscription $(NETWORK_ARGS)
