# C++ OOP + Design Patterns — TCS Prime Interview Q&A

## TOP OOP INTERVIEW QUESTIONS

### Q1. What are the 4 pillars of OOP?
| Pillar | One-line meaning |
|---|---|
| **Encapsulation** | Wrap data + methods together, hide internals using access specifiers |
| **Inheritance** | Child class reuses parent class code (`class Dog : public Animal`) |
| **Polymorphism** | Same interface, different behavior (overloading + virtual functions) |
| **Abstraction** | Hide complexity, show only what's needed (abstract classes, interfaces) |

---

### Q2. Difference between Compile-time and Runtime Polymorphism?
| | Compile-time | Runtime |
|---|---|---|
| Also called | Static polymorphism | Dynamic polymorphism |
| Mechanism | Function overloading, Operator overloading | Virtual functions, Overriding |
| Resolved | At compile time | At runtime |
| Speed | Faster | Slightly slower (vtable lookup) |

---

### Q3. What is a virtual function? Why do we need it?
- A function declared with `virtual` in base class
- Allows the **correct derived class method** to be called via base class pointer
- Without `virtual`, base class method always gets called regardless of actual object type
```cpp
Animal* a = new Dog();
a->speak();  // WITHOUT virtual → Animal::speak()
             // WITH virtual    → Dog::speak()  ✓
```

---

### Q4. What is a pure virtual function?
- `virtual void foo() = 0;`
- Has **no implementation** in base class
- Any class with ≥1 pure virtual function is an **abstract class**
- Cannot instantiate abstract class directly
- Subclass **must** override it

---

### Q5. Why should destructors be virtual in base class?
```cpp
Animal* a = new Dog();
delete a;  // WITHOUT virtual destructor → only ~Animal() called (memory leak!)
           // WITH virtual destructor    → ~Dog() then ~Animal() called ✓
```

---

### Q6. Difference between Overloading and Overriding?
| | Overloading | Overriding |
|---|---|---|
| Same class? | Yes | No (parent-child) |
| Signature | Different params | Same signature |
| When | Compile time | Runtime |
| keyword | — | `override` |

---

### Q7. What is a copy constructor? When is it called?
```cpp
MyClass(const MyClass& other);  // copy constructor signature
```
Called when:
1. Object initialized from another object: `MyClass b = a;`
2. Object passed by value to a function
3. Object returned by value from a function

**Shallow copy** = copies pointer address (dangerous — double delete!)
**Deep copy** = allocates new memory and copies values ✓

---

### Q8. Difference between struct and class in C++?
- `struct`: members are **public** by default
- `class`: members are **private** by default
- Both support inheritance, methods, constructors

---

### Q9. What is the `this` pointer?
- Implicit pointer available inside every non-static member function
- Points to the current object calling the method
- Use: resolve name conflict, enable method chaining, return self

---

### Q10. What is a friend function?
- Not a member of the class but has access to private and protected members
- Declared with `friend` keyword inside the class
- Breaks encapsulation slightly — use sparingly

---

## TOP DESIGN PATTERN INTERVIEW QUESTIONS

### Q11. What is the Singleton pattern? How to make it thread-safe?
```cpp
// Thread-safe (C++11 — Meyers' Singleton)
class Singleton {
public:
    static Singleton& getInstance() {
        static Singleton instance;  // guaranteed thread-safe in C++11
        return instance;
    }
private:
    Singleton() {}
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
};
```

---

### Q12. Factory vs Abstract Factory?
| | Factory Method | Abstract Factory |
|---|---|---|
| Creates | One product | Family of related products |
| Example | One Button (Windows or Mac) | Button + Checkbox (must match) |

---

### Q13. When to use Decorator vs Inheritance?
- **Inheritance**: behavior known at compile time, fixed hierarchy
- **Decorator**: behavior added/removed at runtime, any combination
- Decorator avoids class explosion (MilkCoffee, SugarMilkCoffee, etc.)

---

### Q14. Observer Pattern — explain with real-world example?
- **YouTube**: when a channel uploads, all subscribers get notified
- **Discord**: when someone sends a message, all online users are notified
- Components: `Subject` (observable) + `Observer` (subscriber)
- Subject notifies all registered observers on state change

---

### Q15. Strategy vs Template Method?
| | Strategy | Template Method |
|---|---|---|
| Varies | Whole algorithm | Parts of algorithm |
| Mechanism | Composition (inject object) | Inheritance (override methods) |
| Example | Swap sort algorithm | Common mine() with custom parse() |

---

### Q16. What problem does the Adapter pattern solve?
- Two incompatible interfaces need to work together
- You can't change the existing code (legacy/third-party)
- Adapter wraps old interface to match new expected interface
- Real world: power plug adapters, USB-C to HDMI

---

### Q17. What is the difference between Proxy and Decorator?
| | Proxy | Decorator |
|---|---|---|
| Purpose | Control access | Add functionality |
| Example | Lazy loading, auth check | Add milk to coffee |

---

### Q18. Explain SOLID principles briefly?
| Principle | Meaning | Violation example |
|---|---|---|
| **S**ingle Responsibility | One class = one job | `UserService` handles login + email + DB |
| **O**pen/Closed | Extend, don't modify | Adding `if` for every new shape in area() |
| **L**iskov Substitution | Subclass usable as base | Square breaking Rectangle |
| **I**nterface Segregation | No fat interfaces | `IWorker.eat()` for robots |
| **D**ependency Inversion | Depend on abstractions | `MySQLDB` hardcoded instead of `IDatabase` |

---

## QUICK MEMORY TRICKS

```
4 OOP pillars:    E-I-P-A  (Every Indian Prefers Abstraction)
                  Encapsulation, Inheritance, Polymorphism, Abstraction

Creational:       S-F-A-B-P  (Smart Factory Always Builds Products)
                  Singleton, Factory, Abstract Factory, Builder, Prototype

Structural:       A-D-F-P-C  (Adapters Decorate Facades Proxies Compose)
                  Adapter, Decorator, Facade, Proxy, Composite

Behavioral:       O-S-C-T-S  (Observers Strategize Commands Templates States)
                  Observer, Strategy, Command, Template Method, State
```

---

## FILES IN THIS GUIDE
- `01_oop_fundamentals.cpp` — All OOP concepts with running code
- `02_design_patterns.cpp`  — 14 design patterns with running code
- `03_interview_qa.md`      — This file: top Q&A for quick revision

**Compile & run:**
```bash
g++ -std=c++17 01_oop_fundamentals.cpp -o oop && ./oop
g++ -std=c++17 02_design_patterns.cpp  -o dp  && ./dp
```
