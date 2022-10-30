# Flagger

![](https://img.shields.io/github/license/grano22/flagger.svg)
[![StackBlitz](https://img.shields.io/badge/StackBlitz-Edit-blue?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAABECAYAAAD+1gcLAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AINBw4X0bTGRQAABSxJREFUaN7VmVtsFFUYx//fmQW79bbd2QKpaIIaDcGoifFBEgMGqTTRRA01SgxE5Rbi7QG6S3lgo9J2twpeotxEQlCigLdoQwJ4ARN9QB9MRCNRDBdRzE7LJbTSmTl/H4BYStmd2Z3tDOdt5lzml/9833fO9x0gYi2xgom6Tt5aapyKEnRDlrVGPzfGT+G3SwZ87HLGT8f5uYD7jmSl99IAX80RfTY3A5wMqDVepoQPnqVKHtMbAN4PyJeFtPwafXBSknG9UoDHAIDQq7xODRU8mdc5Aeaeffy7O2F8GnnwZM5dKsCic88CrMU8sSMNbubdZwTIDnjlOoZa52eNYQc3c84sEK+d/1a6ji2UA5EFN3POw4C8fcYy/m+a3p1y2MGTOXsqIJsAxAZ1Hei53tgeSfBkBycK1McALrswJGIVHhE3cuD1ed4uorsAXD5Ed7/hqvXlrFtV8LpO3qKpdwJIDLn/AB/+s0SORgp8VJ43KK23AzAvNsagWlXu+lKV6LGc14itvyEwrsiwX6wWNQEijITiY9pYD1vvKAENAG+VC40hQlNlNt3Bq22lt4EYX2Jor6PVe5V8KzDFG7KsFXE/A3GHB/vcdHyx9IQPnuXI/ji3CuRuT+N1+U4ZHPhmGqk43yXY5C0ccE9hsfwQLjgp5n69hmCz9ylYGcRPrgg8ldfLIXjSx5RjNX3GB6GCm3m3ncDz/v4QNnjJ4KsGbubdVhAZ35YFtTaoKOY7jps5dwGIZf73aH7dnZa9QYH72vLNDmcmRNaX86eEnGvT2BoIdA0o3pV2HgRkS9C7bXnRDGlPypmd9r2AvB8FaAFetDJGvqTiyU7eJWeOp1cgfOo3rRbj6ZJRJdHB20TrrkhAAxutXvVsSedMtfEmGno3gNHhM8snVp80IytO0The18HraOgdkYCm7KyLy6MDoYdUfNQyjnZjeheAm8NXmt/FlDH16CI5dUHaN/DhypeZUqK/AkomAsMQ8fCjq41GKy0nim75ydd51UjX3QZgQgQccV/MUfcVSzYM4Mw1hnPa7QJkYgSgD2qqe6xWOVL8kLWaI3ptbgFkUgSgjwpUY09GDpY8ZJnH9UsExhPYH8CuVgtgTJlzC5pqipXxdpUSaF3FzLkdANJleOIJETWlkJbvh78glOVIM64PARjlc2afiGoqtMiuUMoTqRp3ehnQtpDNfqEDBdeC+T6nuELOLGRiXVVPJC5u2xwP6L0+1qOQ8wqZWNmpXECK6wV+RBCipRLoQBRvyLL2dFwfBlDnTWos7W4xXgi3IATg31p3hldoEG8EAR0IuEC8OuUGK62eCyoYVARutvNOL9VZQD6yxqmnKqmHB6u46PkejHp7XVxmlHOzVhXnTKxgwujXhzH0bdo56m9jymgcKhEITXFl61lFoYV7BMa0akCjkjqJEHOKdP/U7xhNJ1vlZLXOv2Upnmq3JxfJlH4XRzWebBWrmgf38hRXav5F4vSfjqGmHl8if1W/NuSzjWljvW3oQxh0Ly9AQRtqUvdC+Xk4UiXfpmLH9JzB0CBOQKtpwwXtHzxLJcTsQW97FdQDQVxIVc3GUzVuEyEDb4z7NTndysju4c6qfSlOOc8pXQof78nEtoVRDvDsnMlXeK04+o+ztRgSnNOdjq1DSM2z4uLoeecKSCQWhgntXfEsY2ZcHwDQAMESq8VoC7ty5EnxZK37EIAGAV6NArT3c3def2Hm3HdASlSYSipe384bAR6x+tTsIBOBqoMTzlirVz2BrOgoWcF/mizikfkwKiQAAAAASUVORK5CYII=)](https://stackblitz.com/github/grano22/flagger)

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

## Feature definition

```js
const featureDefinition = {
    name: '', // min 4 letters and max 25 letters
    default: false, // boolean, optional - means, that feature can be active for initial state
    version: string, // min 1 and max 10 letters
    hidden: false, // boolean, optional
    description: '', // string, min 5 letters and max 250 letters
    tags: undefined, // Array<string>, optional
    activators: [], // FlaggerActivator, optional
    constraint: undefined // FlaggerConstraint, optional
};
```

## Load configuration

```js
// Via constructor - internal config
const featureManager = new FlaggerFeaturesManager(featureManagerConfig);

// Via method - internal config
const featureManager = new FlaggerFeaturesManager();
featureManager.loadConfig(featureManagerConfig);

// Via method - external, imported as object config
// In this case constraint should be a string
const featureManager = new FlaggerFeaturesManager();
await featureManager.loadExternalConfig(featureManagerConfig);
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
   ],
  "constraintDeserializers": [
      
  ]
}
```

Example in js (custom constraint):
```js
const flaggerCustomConstraint = new FlaggerCustomConstraint({
    checker: async () => window.navigator.language.startsWith('en')
});
```

## Constraint Deserializers (External config)

### Custom Deserializers

**externalConfig.json**:
```json
{
  "features": [
    {
      "name": "SomeFeature",
      "version": "0.0.2",
      "description": "Real feature :)",
      "constraint": "representativeName('sm')"
    }
  ],
  "constraintDeserializers": [
    "pathToExternalSerializerScript.js"
  ]
}
```

**pathToExternalSerializerScript.js**:
```js
import FlaggerCustomConstraint from 'features-flagger';

export default {
    representativeName: 'representativeName',

    deserialize(sm) {
        return new FlaggerCustomConstraint({
            checker: async () => sm === 'sw'
        });
    }  
};
```