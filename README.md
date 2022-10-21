# Flagger

[](https://img.shields.io/github/license/grano22/flagger.svg)

**Flagger** is a core library designed for feature flags. You can
easily manage your features in separation, almost every feature can be modular.

## Usage

```js
const featureManagerConfig = {
    //Define features
    features: [
        {
            name: 'Feature1',
            description: 'Test feature 1',
            version: '0.1',
            default: false // Inactive by default
        }
    ]
};
const featureManager = new FlaggerFeaturesManager(featureManagerConfig);

await featureManager.loadFeatures(); // Load features and check constraint.
```

