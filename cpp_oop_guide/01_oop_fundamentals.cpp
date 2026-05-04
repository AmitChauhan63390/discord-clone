/*
=============================================================================
  C++ OOP FUNDAMENTALS — TCS Prime Interview Crash Course
=============================================================================

FOUR PILLARS OF OOP:
  1. Encapsulation  — Bundling data + methods, hiding internals
  2. Inheritance    — Child class reuses parent class code
  3. Polymorphism   — Same interface, different behavior
  4. Abstraction    — Hiding complex implementation, showing only essentials
=============================================================================
*/

#include <iostream>
#include <string>
using namespace std;

// ============================================================
// 1. CLASS & OBJECT — Blueprint vs Instance
// ============================================================
class Car {
private:                     // only accessible inside the class (Encapsulation)
    string brand;
    int speed;

public:                      // accessible everywhere
    // Constructor — called automatically when object is created
    Car(string b, int s) : brand(b), speed(s) {
        cout << "Car created: " << brand << endl;
    }

    // Destructor — called automatically when object is destroyed
    ~Car() {
        cout << "Car destroyed: " << brand << endl;
    }

    // Getter (accessor)
    string getBrand() { return brand; }
    int getSpeed()    { return speed; }

    // Setter (mutator)
    void setSpeed(int s) {
        if (s >= 0) speed = s;   // validation — encapsulation in action
    }

    void display() {
        cout << brand << " goes at " << speed << " km/h" << endl;
    }
};

// ============================================================
// 2. INHERITANCE — "is-a" relationship
// ============================================================
class Animal {
public:
    string name;

    Animal(string n) : name(n) {}

    void eat() { cout << name << " is eating" << endl; }

    // virtual — allows child class to OVERRIDE this (runtime polymorphism)
    virtual void speak() { cout << name << " makes a sound" << endl; }

    // Always make destructor virtual in base class!
    virtual ~Animal() {}
};

// Single Inheritance
class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}   // calling parent constructor

    void speak() override {        // override keyword — catches typos at compile time
        cout << name << " says: Woof!" << endl;
    }

    void fetch() { cout << name << " fetches the ball!" << endl; }
};

class Cat : public Animal {
public:
    Cat(string n) : Animal(n) {}

    void speak() override {
        cout << name << " says: Meow!" << endl;
    }
};

// Multilevel Inheritance: A -> B -> C
class GuideDog : public Dog {
public:
    GuideDog(string n) : Dog(n) {}

    void guide() { cout << name << " is guiding its owner" << endl; }
};

// Multiple Inheritance: inherits from TWO parents
class Flyable {
public:
    void fly() { cout << "Flying!" << endl; }
};

class FlyingDog : public Dog, public Flyable {
public:
    FlyingDog(string n) : Dog(n) {}
};

// ============================================================
// 3. POLYMORPHISM
// ============================================================

// --- Compile-time Polymorphism (Function Overloading) ---
class Calculator {
public:
    int add(int a, int b)          { return a + b; }
    double add(double a, double b) { return a + b; }     // same name, different params
    int add(int a, int b, int c)   { return a + b + c; } // same name, different count
};

// --- Compile-time Polymorphism (Operator Overloading) ---
class Vector2D {
public:
    float x, y;
    Vector2D(float x, float y) : x(x), y(y) {}

    // overloading + operator
    Vector2D operator+(const Vector2D& other) {
        return Vector2D(x + other.x, y + other.y);
    }

    void print() { cout << "(" << x << ", " << y << ")" << endl; }
};

// --- Runtime Polymorphism (Virtual Functions) ---
// Base class pointer pointing to child class object
void makeAnimalSpeak(Animal* animal) {
    animal->speak();   // calls the correct speak() at RUNTIME based on actual type
}

// ============================================================
// 4. ABSTRACTION — Pure Virtual Functions & Abstract Classes
// ============================================================
class Shape {                // Abstract class — cannot instantiate directly
public:
    virtual double area()      = 0;   // pure virtual — MUST override in child
    virtual double perimeter() = 0;

    void describe() {
        cout << "Area: " << area() << ", Perimeter: " << perimeter() << endl;
    }

    virtual ~Shape() {}
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area()      override { return 3.14159 * radius * radius; }
    double perimeter() override { return 2 * 3.14159 * radius; }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area()      override { return w * h; }
    double perimeter() override { return 2 * (w + h); }
};

// ============================================================
// 5. STATIC MEMBERS — shared across ALL objects
// ============================================================
class Counter {
    static int count;   // one copy shared by all objects
    int id;
public:
    Counter() {
        count++;
        id = count;
    }
    static int getCount() { return count; }   // static method — no 'this' pointer
    int getId()           { return id; }
};
int Counter::count = 0;   // static member must be defined outside class

// ============================================================
// 6. FRIEND FUNCTION — can access private members
// ============================================================
class Box {
    double width;
public:
    Box(double w) : width(w) {}
    friend void printWidth(Box b);   // granting access
};

void printWidth(Box b) {
    cout << "Width: " << b.width << endl;  // accessing private member
}

// ============================================================
// 7. COPY CONSTRUCTOR & DEEP COPY
// ============================================================
class MyArray {
    int* data;
    int size;
public:
    MyArray(int s) : size(s) {
        data = new int[size];
    }

    // Deep copy constructor — creates new memory (NOT just copying pointer)
    MyArray(const MyArray& other) : size(other.size) {
        data = new int[size];
        for (int i = 0; i < size; i++)
            data[i] = other.data[i];
    }

    ~MyArray() { delete[] data; }  // always delete heap memory
};

// ============================================================
// 8. THIS POINTER — points to the calling object
// ============================================================
class Person {
    string name;
    int age;
public:
    Person(string name, int age) {
        this->name = name;  // 'this->name' = member, 'name' = parameter
        this->age  = age;
    }

    Person& setName(string name) {
        this->name = name;
        return *this;   // return self — enables method chaining
    }

    Person& setAge(int age) {
        this->age = age;
        return *this;
    }

    void display() {
        cout << name << ", age " << age << endl;
    }
};

// ============================================================
// MAIN — putting it all together
// ============================================================
int main() {
    cout << "\n=== CLASS & OBJECT ===" << endl;
    Car c1("Toyota", 120);
    c1.display();
    c1.setSpeed(150);
    c1.display();

    cout << "\n=== INHERITANCE ===" << endl;
    Dog d("Buddy");
    d.eat();    // inherited from Animal
    d.speak();  // overridden in Dog
    d.fetch();  // Dog's own method

    cout << "\n=== RUNTIME POLYMORPHISM ===" << endl;
    Animal* animals[] = { new Dog("Rex"), new Cat("Whiskers") };
    for (auto a : animals) {
        makeAnimalSpeak(a);  // calls correct speak() at runtime
        delete a;
    }

    cout << "\n=== ABSTRACTION ===" << endl;
    Shape* s1 = new Circle(5);
    Shape* s2 = new Rectangle(4, 6);
    s1->describe();
    s2->describe();
    delete s1; delete s2;

    cout << "\n=== FUNCTION OVERLOADING ===" << endl;
    Calculator calc;
    cout << calc.add(2, 3) << endl;
    cout << calc.add(2.5, 3.5) << endl;
    cout << calc.add(1, 2, 3) << endl;

    cout << "\n=== OPERATOR OVERLOADING ===" << endl;
    Vector2D v1(1, 2), v2(3, 4);
    Vector2D v3 = v1 + v2;
    v3.print();

    cout << "\n=== STATIC MEMBERS ===" << endl;
    Counter c2, c3, c4;
    cout << "Total objects: " << Counter::getCount() << endl;

    cout << "\n=== METHOD CHAINING (this pointer) ===" << endl;
    Person p("Alice", 25);
    p.setName("Bob").setAge(30).display();

    return 0;
}

/*
=============================================================================
  QUICK REVISION CHEATSHEET
=============================================================================

ACCESS SPECIFIERS:
  private   → only inside the class
  protected → inside class + derived classes
  public    → everywhere

INHERITANCE TYPES:
  Single       → class B : public A
  Multiple     → class C : public A, public B
  Multilevel   → A -> B -> C
  Hierarchical → A -> B, A -> C
  Hybrid       → mix of above

VIRTUAL vs PURE VIRTUAL:
  virtual void foo() { }   → has body, CAN be overridden
  virtual void foo() = 0;  → NO body, MUST be overridden (abstract)

KEY RULES:
  - Always virtual destructor in base class
  - Use override keyword in derived class
  - Static methods have no 'this' pointer
  - Deep copy = new memory; Shallow copy = same pointer (dangerous!)
  - Abstract class = has at least one pure virtual function

=============================================================================
*/
