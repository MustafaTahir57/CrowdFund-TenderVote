export const tenderVotingAddress = "0x7e17c5D42d97836bBEB08Ed84a263345445E46a9";
export const tenderVotingAbi = [{"inputs":[{"internalType":"address","name":"tenderAddress","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"tOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tenderId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"votes","type":"uint256"}],"name":"ProposalVoted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tenderId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"string","name":"proposalDescription","type":"string"},{"indexed":false,"internalType":"address","name":"winner","type":"address"}],"name":"WinnerProposal","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"authorityMembers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tenderId","type":"uint256"}],"name":"determineWinner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAuthorityMembers","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tenderId","type":"uint256"},{"internalType":"uint256","name":"_proposalId","type":"uint256"}],"name":"getProposalStatus","outputs":[{"internalType":"enum ITenderContract.PStatus","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tenderId","type":"uint256"}],"name":"isVotingEnded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tenderId","type":"uint256"}],"name":"isVotingStarted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"members","type":"address[]"}],"name":"setAuthorityMembers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"tProposals","outputs":[{"internalType":"address","name":"bidder","type":"address"},{"internalType":"uint256","name":"tenderID","type":"uint256"},{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"string","name":"proposalDescription","type":"string"},{"internalType":"enum ITenderContract.PStatus","name":"proposalStatus","type":"uint8"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tenderContract","outputs":[{"internalType":"contract ITenderContract","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract ISABZ_Token","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tenderId","type":"uint256"},{"internalType":"uint256","name":"_proposalId","type":"uint256"}],"name":"voteForProposal","outputs":[],"stateMutability":"nonpayable","type":"function"}]