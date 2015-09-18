# Javascript MVar

An MVar is a concurrency abstraction. An MVar object can either hold a
value or be empty. The two basic operations on an MVar are

- Attempt to take the value. If there is no value then you will have
to wait. If you ever stop waiting you can be guaranteed you have a
value.
- Attempt to put a value into the MVar. If there is already a value
then you will have to wait until something takes it.

In javascript "waiting" means using callbacks. When you access MVars
you will provide callbacks to allow the possibility that the values
you want are not available yet.

MVars are a low-level mechanism on top of which you can build other kinds
of concurrency concepts. However they are simple enough to be directly
applicable in certain situations without much hard thinking.

## Examples

```
> var mv = newMVar("shoes")
=> MVar {"shoes"}

> mv.take(function(x){ console.log("I took "+x); }); mv
I took shoes
=> MVar {}

> mv.take(function(x){ console.log("A: got my "+x); })
(nothing happens, nothing to take)

> mv.take(function(x){ console.log("B: got my "+x); })
(nothing happens, nothing to take)

> mv.put("shoes")
A: got my shoes

> mv.put("shoes")
B: got my shoes

> mv.put("shoes", function(){ console.log("A: shoes delivered"); });
A: shoes delivered

> mv.put("shoes", function(){ console.log("B: shoes delivered"); });
(nothing happens, shoes in the way)

> mv.take(function(x){ console.log("C: got my "+x); }); mv
C: got my shoes
B: shoes delivered
MVar {"shoes"}
```

As the example implies, callbacks will be dispatched in the order
that they got in line (FIFO). But you shouldn't rely on the ordering of
put and take callbacks.


## API

- newMVar(x): a new mvar holding the value x.
- newEmptyMVar(): a new empty mvar.
- mv.take(cb): Take the value and provide to cb when possible.
- mv.put(x, cb): Put x then run cb when possible.
- mv.read(cb): Run the cb on the value when possible without taking it.
- mv.borrow(cb): Take the value, run the cb on it, then put it back.
This will put the value back even if cb causes an error.
- mv.swap(cb): Take the value, run the cb on it, and put the return value
back in its place. If cb causes an error the original value is put back.
- mv.tryTake(): Try to take the value immediately. If there is a value x
then {some: x} is returned. Otherwise you will get {none: true}.
- mv.tryPut(x): Try to put a value right now. Returns true if the put was
successful otherwise false.
- mv.isEmpty(): Check the instantaneous emptiness of the MVar. In general
you can't rely on this to do anything. However in javascript it may be
possible to use this productively if you know what you're doing.
