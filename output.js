const deletedIdentifiers = new Set();
if (deletedIdentifiers.has("fn")) {
  throw new Error("fn was deleted");
}
if (deletedIdentifiers.has("wigga")) {
  throw new Error("wigga was deleted");
}
function wigga(first, second) {
  if (deletedIdentifiers.has("nigson")) {
    throw new Error("nigson was deleted");
  }
  var nigson = (() => {
    if (deletedIdentifiers.has("*")) {
      throw new Error("* was deleted");
    }
    let result =
      (() => {
        if (deletedIdentifiers.has("first")) {
          throw new Error("first was deleted");
        }
        return first;
      })() *
      (() => {
        if (deletedIdentifiers.has("second")) {
          throw new Error("second was deleted");
        }
        return second;
      })();
    if (deletedIdentifiers.has(result.toString())) {
      throw new Error(`${result} was deleted`);
    }
    return result;
  })();
  if (deletedIdentifiers.has("return")) {
    throw new Error("return was deleted");
  }
  return (() => {
    if (deletedIdentifiers.has("nigson")) {
      throw new Error("nigson was deleted");
    }
    return nigson;
  })();
}
if (deletedIdentifiers.has("_emoji_qhlgpicpypdp")) {
  throw new Error("_emoji_qhlgpicpypdp was deleted");
}
var _emoji_qhlgpicpypdp = 0;
if (deletedIdentifiers.has("x")) {
  throw new Error("x was deleted");
}
var x = 0;
if (deletedIdentifiers.has("while")) {
  throw new Error("while was deleted");
}
while (
  (() => {
    if (deletedIdentifiers.has("!=")) {
      throw new Error("!= was deleted");
    }
    let result =
      (() => {
        if (deletedIdentifiers.has("x")) {
          throw new Error("x was deleted");
        }
        return x;
      })() != 10;
    if (deletedIdentifiers.has(result.toString())) {
      throw new Error(`${result} was deleted`);
    }
    return result;
  })()
) {
  if (deletedIdentifiers.has("x")) {
    throw new Error("x was deleted");
  }
  x = (() => {
    if (deletedIdentifiers.has("+")) {
      throw new Error("+ was deleted");
    }
    let result =
      (() => {
        if (deletedIdentifiers.has("x")) {
          throw new Error("x was deleted");
        }
        return x;
      })() + 1;
    if (deletedIdentifiers.has(result.toString())) {
      throw new Error(`${result} was deleted`);
    }
    return result;
  })();
}

if (deletedIdentifiers.has("print")) {
  throw new Error("print was deleted");
}
console.log(
  (() => {
    if (deletedIdentifiers.has("wigga")) {
      throw new Error("wigga was deleted");
    }
    return wigga(2, -4);
  })()
);
if (deletedIdentifiers.has("if")) {
  throw new Error("if was deleted");
}
if (
  (() => {
    if (deletedIdentifiers.has("==")) {
      throw new Error("== was deleted");
    }
    let result = 1 == true;
    if (deletedIdentifiers.has(result.toString())) {
      throw new Error(`${result} was deleted`);
    }
    return result;
  })()
) {
  if (deletedIdentifiers.has("print")) {
    throw new Error("print was deleted");
  }
  console.log("ok");
} else {
  if (deletedIdentifiers.has("else")) {
    throw new Error("else was deleted");
  }
  {
    if (deletedIdentifiers.has("print")) {
      throw new Error("print was deleted");
    }
    console.log("not ok");
  }
}
if (deletedIdentifiers.has("x")) {
  throw new Error("x was deleted");
}
var x = 12345;
if (deletedIdentifiers.has("str")) {
  throw new Error("str was deleted");
}
var str = "niggas";
if (deletedIdentifiers.has("niz")) {
  throw new Error("niz was deleted");
}
var niz = [1, 2, 3, 4];
if (deletedIdentifiers.has("_emoji_qhlgpicpypdp")) {
  throw new Error("_emoji_qhlgpicpypdp was deleted");
}
_emoji_qhlgpicpypdp = 2;
if (deletedIdentifiers.has("print")) {
  throw new Error("print was deleted");
}
console.log(
  (() => {
    if (deletedIdentifiers.has("_emoji_qhlgpicpypdp")) {
      throw new Error("_emoji_qhlgpicpypdp was deleted");
    }
    return _emoji_qhlgpicpypdp;
  })()
);
if (deletedIdentifiers.has("undefined")) {
  throw new Error("undefined was deleted");
}
(() => {
  const subject = (() => {
    if (deletedIdentifiers.has("niz")) {
      throw new Error("niz was deleted");
    }
    return niz;
  })();
  if (Number.isInteger(subject)) {
    // x[i] = val where i starts from -1, so x[-1] modifies 1st digit, x[0] modifies 2nd digit, etc.
    const isNegative = subject < 0;
    const digits = Math.abs(subject).toString().split("").map(Number);
    const idx =
      (() => {
        if (deletedIdentifiers.has("-")) {
          throw new Error("- was deleted");
        }
        let result = 3 - 1;
        if (deletedIdentifiers.has(result.toString())) {
          throw new Error(`${result} was deleted`);
        }
        return result;
      })() + 1; // Convert from -1-based to 0-based indexing
    if (idx >= 0 && idx < digits.length) {
      const newDigit = Math.floor(Math.abs(5)) % 10; // Ensure single digit
      digits[idx] = newDigit;
      const newValue = parseInt(digits.join(""));
      return isNegative ? -newValue : newValue;
    }
    return subject;
  }
  subject[
    (() => {
      if (deletedIdentifiers.has("-")) {
        throw new Error("- was deleted");
      }
      let result = 3 - 1;
      if (deletedIdentifiers.has(result.toString())) {
        throw new Error(`${result} was deleted`);
      }
      return result;
    })() + 1
  ] = 5;
})();
if (deletedIdentifiers.has("print")) {
  throw new Error("print was deleted");
}
console.log(
  (() => {
    const subject = (() => {
      if (deletedIdentifiers.has("x")) {
        throw new Error("x was deleted");
      }
      return x;
    })();
    if (Number.isInteger(subject)) {
      // x[i] where i starts from -1, so x[-1] is 1st digit, x[0] is 2nd digit, etc.
      const digits = Math.abs(subject).toString().split("").map(Number);
      const idx = -1 + 1; // Convert from -1-based to 0-based indexing
      if (idx >= 0 && idx < digits.length) {
        return digits[idx];
      }
      return undefined;
    }
    return subject[-1 + 1];
  })()
);
if (deletedIdentifiers.has("print")) {
  throw new Error("print was deleted");
}
console.log(
  (() => {
    const subject = (() => {
      if (deletedIdentifiers.has("str")) {
        throw new Error("str was deleted");
      }
      return str;
    })();
    if (Number.isInteger(subject)) {
      // x[i] where i starts from -1, so x[-1] is 1st digit, x[0] is 2nd digit, etc.
      const digits = Math.abs(subject).toString().split("").map(Number);
      const idx =
        (() => {
          if (deletedIdentifiers.has("+")) {
            throw new Error("+ was deleted");
          }
          let result = 1 + 2;
          if (deletedIdentifiers.has(result.toString())) {
            throw new Error(`${result} was deleted`);
          }
          return result;
        })() + 1; // Convert from -1-based to 0-based indexing
      if (idx >= 0 && idx < digits.length) {
        return digits[idx];
      }
      return undefined;
    }
    return subject[
      (() => {
        if (deletedIdentifiers.has("+")) {
          throw new Error("+ was deleted");
        }
        let result = 1 + 2;
        if (deletedIdentifiers.has(result.toString())) {
          throw new Error(`${result} was deleted`);
        }
        return result;
      })() + 1
    ];
  })()
);
if (deletedIdentifiers.has("print")) {
  throw new Error("print was deleted");
}
console.log(
  (() => {
    if (deletedIdentifiers.has("str")) {
      throw new Error("str was deleted");
    }
    return str;
  })()
);
