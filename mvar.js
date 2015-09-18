function MVar(mv){

  function isEmpty(){
    return !!mv.empty;
  }

  function take(cb){
    if(mv.empty){
      mv.takeQueue.push(cb);
    }
    else{
      var current = mv.full;
      if(mv.putQueue.length > 0){
        cb(current);
        var put = mv.putQueue.shift();
        mv.full = put.x;
        this._ = put.x;
        if(put.cb) put.cb();
      }
      else{
        delete mv.full;
        mv.empty = true;
        delete this._;
        cb(current);
      }
    }
  }

  function put(x, cb){
    if(mv.empty){
      while(mv.readQueue.length > 0){
        mv.readQueue.shift()(x);
      }
      if(mv.takeQueue.length > 0){
        if(cb) cb();
        mv.takeQueue.shift()(x);
      }
      else{
        delete mv.empty;
        mv.full = x;
        this._ = x;
        if(cb) cb();
      }
    }
    else{
      mv.putQueue.push({x: x, cb: cb});
    }
  }

  function read(cb){
    if(mv.empty){
      mv.readQueue.push(cb);
    }
    else{
      cb(mv.full);
    }
  }

  function tryTake(){
    if(mv.empty){
      return {none: true};
    }
    else{
      var x = mv.full;
      if(mv.putQueue.length > 0){
        var put = mv.putQueue.shift();
        mv.full = put.x;
        this._ = put.x;
        if(put.cb) put.cb();
      }
      else{
        delete mv.full;
        mv.empty = true;
        delete this._;
      }
      return {some: x};
    }
  }

  function tryPut(x){
    if(mv.empty){
      while(mv.readQueue.length > 0){
        mv.readQueue.shift()(x);
      }

      if(mv.takeQueue.length > 0){
        mv.takeQueue.shift()(x);
      }
      else{
        delete mv.empty;
        mv.full = x;
        this._ = x;
      }

      return true;
    }
    else{
      return false;
    }
  }

  function swap(cb){
    this.take(function(x){
      var y;
      try{ y = cb(x); }
      catch(e){
        this.put(x);
        throw e;
      }
      this.put(y);
    });
  }

  function borrow(cb){
    this.take(function(x){
      try{ cb(x); }
      catch(e){
        this.put(x);
        throw e;
      }
      this.put(x);
    });
  }

  this.isEmpty = isEmpty;
  this.take = take;
  this.put = put;
  this.read = read;
  this.tryTake = tryTake;
  this.tryPut = tryPut;
  this.swap = swap;
  this.borrow = borrow;
  this.debug = function(){ return mv; };
}

function newEmptyMVar(){
  return new MVar({
    empty: true,
    putQueue: [],
    takeQueue: [],
    readQueue: []
  });
}

function newMVar(x){
  return new MVar({
    full: x,
    putQueue: [],
    takeQueue: [],
    readQueue: []
  });
}

