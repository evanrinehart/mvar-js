# Javascript MVar

An MVar is a concurrency abstraction. An MVar object can either hold a
value or be empty. The two basic operations on an MVar are

- Attempt to take the value. If there is no value then you will have
to wait. If you ever stop waiting you can be guaranteed you have a
value.
- Attempt to put a value into the MVar. If there is already a value
then you will have to wait until something takes it.

