
import { wrapBiWithUpdateDefaults } from '@wix/yoshi-flow-editor/internal';

const createBILogger = (factoryInstanceOrModule: any) => (userConfig: any = {}) => {
  const factory = typeof factoryInstanceOrModule.factory === 'function' ? factoryInstanceOrModule.factory(userConfig) : factoryInstanceOrModule;
  return wrapBiWithUpdateDefaults(factory, factory.logger());
}

export const createOwnerBILogger = createBILogger;
export const createVisitorBILogger = createBILogger;
