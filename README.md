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

## Constraints

**Constraints** are used to activate feature immediately after load itself. You can define
this one inside script as singular or **FlaggerChainConstraint**. Another possibility is
string sentence but not every kind of constraint supports this capacity.

Example in js (chaining):
```js
const flagChainConstraint = new FlaggerChainConstraint(new FlaggerOnlineConstraint())
    .and(new FlaggerDateIntervalConstraint(
        {
            startDate: new Date(2019, 9, 6),
            endDate: new Date(2022, 10, 11)
        }
    ));
```

Example in json:
```json
{
   "features": [
       {
          "name": "SomeFeature",
          "version": "0.0.1",
          "description": "Some existing feature",
          "constraint": "betweenDate('2022-09-01', '2022-10-14') and isOnline"
       }
   ]
}
```

Example in js (custom constraint):
```js
const flaggerCustomConstraint = new FlaggerCustomConstraint({
    checker: async () => window.navigator.language.startsWith('en')
});
```

