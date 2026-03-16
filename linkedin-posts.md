# Post 1: From Remix to Foundry: Building a Decentralized Lottery

Last post I mentioned Foundry was next. It was a bigger jump than I expected.

I just finished building a decentralized lottery contract as part of Cyfrin Updraft's Foundry Fundamentals course. The contract itself was the most complex thing I've written in Solidity so far: Chainlink VRF for provably fair random winner selection, Chainlink Automation so the draw triggers itself without any human intervention, and a state machine pattern (OPEN/CALCULATING) to prevent players from entering mid-draw.

But the real shift was in the tooling.

With Foundry, you write tests in Solidity itself, not JavaScript. You get cheat codes like vm.prank to impersonate addresses, vm.warp to time-travel, vm.roll to skip blocks. You build mock contracts to simulate oracles locally. You write deployment scripts that work on both Anvil and Sepolia with one command. And you tie it all together with a Makefile.

It felt like going from a notebook to a proper IDE. The contract was harder, but the tooling made it manageable. Being able to fuzz test my random word fulfillment logic, simulate edge cases, and deploy across environments without changing code. That changed how I think about smart contract development.

If you've made the jump from Remix to Foundry (or Hardhat), what was the moment it clicked for you?

#Solidity #Foundry #SmartContracts #ChainlinkVRF #Web3 #BlockchainDev #LearningInPublic

---

# Post 2: I Ran an AI Security Audit on My Lottery Contract. Here's What It Found.

After building the decentralized lottery I mentioned in my last post, I got curious: what would a security audit reveal on code written during a course?

So I ran an AI-assisted security review on my Raffle contract. The results were humbling.

The most critical finding: if the winner happens to be a smart contract that reverts on receive, the entire raffle gets permanently stuck. Chainlink VRF marks the randomness request as fulfilled and never retries. All collected ETH becomes unrecoverable. The fix is a pull-payment pattern, where the winner withdraws instead of being pushed funds. A well-known pattern I hadn't thought to apply.

Second finding: the fulfillRandomWords callback iterates over the entire player array to reset state. With enough players, that loop could exceed the callback gas limit, bricking the raffle the same way. The fix is straightforward: cap max players or restructure the reset.

Both are real production vulnerabilities hiding in "learning" code.

What struck me most is that these aren't exotic edge cases. Push vs pull payment and gas bounds on callbacks are patterns experienced auditors check first. The AI caught them instantly. It is not a replacement for a manual audit, but as a first pass, it surfaced issues I would have missed entirely.

Have you tried using AI tools as part of your security review process? Curious what others are finding.

#SmartContractSecurity #Solidity #Web3Security #BlockchainDev #SecurityAudit #LearningInPublic
