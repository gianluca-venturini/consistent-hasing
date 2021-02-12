# consistent-hasing

Simple implementation of consistent hashing inspired by https://www.toptal.com/big-data/consistent-hashing.

This implementation maps a set of values into N possible servers, providing the following properties:
1. Adding one server will redistribute a fair amount of values to that server, removing them fairly from all the other servers
2. Adding one server will not move values among the present servers
3. The opposite is true for removing a server


### Example

In this example server `[4]` is added to the existing servers `[0, 1, 2, 3]`, the number of values moved are indicated with `{source} -> {destination}: {num_keys}`.
```
  [ '0 -> 4', 488 ],
  [ '1 -> 4', 506 ],
  [ '2 -> 4', 500 ],
  [ '3 -> 4', 561 ]
```
Note that no value is moved between existing servers, only moved from existing to the new.