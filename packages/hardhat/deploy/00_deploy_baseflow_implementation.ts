import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the BaseFlowImplementation contract
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployBaseFlowImplementation: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // For testing purposes, we'll deploy a mock USDC first
  // In production, you would use the real USDC address for the network
  const mockUsdc = await deploy("MockUSDC", {
    from: deployer,
    args: ["Mock USDC", "USDC", 6],
    log: true,
    autoMine: true,
  });

  // Deploy BaseFlowImplementation
  await deploy("BaseFlowImplementation", {
    from: deployer,
    args: [mockUsdc.address],
    log: true,
    autoMine: true,
  });
};

export default deployBaseFlowImplementation;

// Tags help to identify which scripts have run and which haven't
deployBaseFlowImplementation.tags = ["BaseFlowImplementation"];
