// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./lib/IERC20.sol";
import "./lib/SafeMath.sol";
import "./lib/IUniSwapV2.sol";
import "./lib/IUniSwapV3.sol";

/**
  Quote V3

  Github: https://github.com/Uniswap/v3-periphery/blob/main/contracts/interfaces/IQuoter.sol
  Doc: https://docs.uniswap.org/contracts/v3/reference/periphery/interfaces/IQuoter
  EtherScan: https://etherscan.io/address/0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6#writeContract
 */
import "./lib/IQuoter.sol";

// Swap
contract SwapBak {
    // UniSwap V2 Router
    address uRouterV2Address = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 public uRouterV2 = IUniswapV2Router02(uRouterV2Address);

    // UniSwap V3 Router
    address uRouterV3Address = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    ISwapRouter public uRouterV3 = ISwapRouter(uRouterV3Address);

    // Owner of the Contract
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    /// @notice Swaps a fixed amount of WETH for a maximum possible amount of DAI
    function executeTrade(
        bool _useUniSwapV2,
        address _quote,
        address _base,
        uint256 _amountIn,
        uint256 _slippage
    ) external {
        require(
            IERC20(_quote).transferFrom(msg.sender, address(this), _amountIn),
            "Token transfer from wallet to contract failed due to un-approval"
        );

        address[] memory _path = new address[](2);
        _path[0] = _quote;
        _path[1] = _base;

        if (_useUniSwapV2) {
            // Swap on Uniswap V2
            require(
                IERC20(_path[0]).approve(address(uRouterV2), _amountIn),
                "UniswapV2 approval failed."
            );

            uint[] memory _amountsOut = uRouterV2.getAmountsOut(
                _amountIn,
                _path
            );

            uint256 _amountOut = SafeMath.mul(_amountsOut[1], 100 - _slippage);

            uRouterV2.swapExactTokensForTokens(
                _amountIn,
                SafeMath.div(_amountOut, 100),
                _path,
                msg.sender,
                block.timestamp
            );
        } else {
            // Swap on Uniswap V3
            require(
                IERC20(_path[0]).approve(address(uRouterV3), _amountIn),
                "UniswapV3 approval failed."
            );

            ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
                .ExactInputSingleParams({
                    tokenIn: _quote,
                    tokenOut: _base,
                    // pool fee 0.3%
                    fee: 10000,
                    recipient: msg.sender,
                    deadline: block.timestamp,
                    amountIn: _amountIn,
                    amountOutMinimum: 0,
                    // NOTE: In production, this value can be used to set the limit
                    // for the price the swap will push the pool to,
                    // which can help protect against price impact
                    sqrtPriceLimitX96: 0
                });
            uRouterV3.exactInputSingle(params);
        }
    }
}
