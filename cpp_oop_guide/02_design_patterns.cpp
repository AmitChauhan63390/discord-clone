/*
=============================================================================
  DESIGN PATTERNS IN C++ — TCS Prime Interview Crash Course
=============================================================================

Design patterns = proven solutions to common software design problems.
23 GoF patterns grouped into 3 categories:

  CREATIONAL  → HOW objects are created
  STRUCTURAL  → HOW objects are composed/organized
  BEHAVIORAL  → HOW objects communicate/interact

Most asked in TCS Prime: Singleton, Factory, Observer, Strategy, Decorator
=============================================================================
*/

#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <algorithm>
using namespace std;

// ============================================================
//  CREATIONAL PATTERNS
// ============================================================

// ---- 1. SINGLETON — only ONE instance ever exists ----
// Use case: DB connection, Logger, Config
class Logger {
private:
    static Logger* instance;  // single instance
    Logger() {}               // private constructor — blocks direct creation

public:
    static Logger* getInstance() {
        if (instance == nullptr)
            instance = new Logger();  // create only once
        return instance;
    }

    void log(const string& msg) {
        cout << "[LOG] " << msg << endl;
    }

    // delete copy constructor and assignment to prevent cloning
    Logger(const Logger&)            = delete;
    Logger& operator=(const Logger&) = delete;
};
Logger* Logger::instance = nullptr;

// Thread-safe Singleton (Modern C++11 — Meyers' Singleton)
class Config {
public:
    static Config& getInstance() {
        static Config instance;  // created once, thread-safe in C++11
        return instance;
    }
    string getDB() { return "mysql://localhost"; }

private:
    Config() {}
};


// ---- 2. FACTORY METHOD — let subclass decide which object to create ----
// Use case: GUI frameworks, cross-platform apps
class Button {
public:
    virtual void render() = 0;
    virtual ~Button() {}
};

class WindowsButton : public Button {
public:
    void render() override { cout << "Rendering Windows Button" << endl; }
};

class MacButton : public Button {
public:
    void render() override { cout << "Rendering Mac Button" << endl; }
};

// Factory — creates objects without exposing creation logic
class ButtonFactory {
public:
    static Button* create(const string& os) {
        if (os == "Windows") return new WindowsButton();
        if (os == "Mac")     return new MacButton();
        return nullptr;
    }
};


// ---- 3. ABSTRACT FACTORY — factory of factories ----
// Use case: UI toolkit (button + checkbox must match same OS theme)
class Checkbox {
public:
    virtual void render() = 0;
    virtual ~Checkbox() {}
};

class WindowsCheckbox : public Checkbox {
public:
    void render() override { cout << "Rendering Windows Checkbox" << endl; }
};

class MacCheckbox : public Checkbox {
public:
    void render() override { cout << "Rendering Mac Checkbox" << endl; }
};

// Abstract factory interface
class GUIFactory {
public:
    virtual Button*   createButton()   = 0;
    virtual Checkbox* createCheckbox() = 0;
    virtual ~GUIFactory() {}
};

class WindowsFactory : public GUIFactory {
public:
    Button*   createButton()   override { return new WindowsButton(); }
    Checkbox* createCheckbox() override { return new WindowsCheckbox(); }
};

class MacFactory : public GUIFactory {
public:
    Button*   createButton()   override { return new MacButton(); }
    Checkbox* createCheckbox() override { return new MacCheckbox(); }
};


// ---- 4. BUILDER — construct complex objects step by step ----
// Use case: SQL query builder, HTML builder, complex config objects
class Pizza {
public:
    string size, crust, sauce;
    vector<string> toppings;

    void display() {
        cout << size << " pizza, " << crust << " crust, " << sauce << " sauce";
        cout << ", toppings: ";
        for (auto& t : toppings) cout << t << " ";
        cout << endl;
    }
};

class PizzaBuilder {
    Pizza pizza;
public:
    PizzaBuilder& setSize(string s)   { pizza.size  = s; return *this; }
    PizzaBuilder& setCrust(string c)  { pizza.crust = c; return *this; }
    PizzaBuilder& setSauce(string s)  { pizza.sauce = s; return *this; }
    PizzaBuilder& addTopping(string t){ pizza.toppings.push_back(t); return *this; }
    Pizza build()                     { return pizza; }
};


// ---- 5. PROTOTYPE — clone existing object instead of creating new ----
// Use case: Game characters, document templates
class Monster {
public:
    string type;
    int hp, attack;

    Monster(string t, int h, int a) : type(t), hp(h), attack(a) {}

    virtual Monster* clone() = 0;  // clone self
    virtual void display()   = 0;
    virtual ~Monster() {}
};

class Goblin : public Monster {
public:
    Goblin(int h, int a) : Monster("Goblin", h, a) {}

    Monster* clone() override { return new Goblin(*this); }  // copy constructor

    void display() override {
        cout << type << " | HP: " << hp << " | ATK: " << attack << endl;
    }
};


// ============================================================
//  STRUCTURAL PATTERNS
// ============================================================

// ---- 6. ADAPTER — makes incompatible interfaces work together ----
// Use case: old API + new interface, third-party library integration

// Old interface (legacy code you can't change)
class OldAudioPlayer {
public:
    void playMP3(string filename) {
        cout << "Playing MP3: " << filename << endl;
    }
};

// New interface expected by the system
class MediaPlayer {
public:
    virtual void play(string type, string file) = 0;
    virtual ~MediaPlayer() {}
};

// Adapter: wraps OldAudioPlayer to match MediaPlayer interface
class AudioAdapter : public MediaPlayer {
    OldAudioPlayer* oldPlayer;
public:
    AudioAdapter() { oldPlayer = new OldAudioPlayer(); }
    ~AudioAdapter() { delete oldPlayer; }

    void play(string type, string file) override {
        if (type == "mp3")
            oldPlayer->playMP3(file);
        else
            cout << "Format not supported: " << type << endl;
    }
};


// ---- 7. DECORATOR — add responsibilities to objects dynamically ----
// Use case: coffee shop (add milk, sugar, caramel to coffee)

class Coffee {
public:
    virtual string getDescription() = 0;
    virtual double getCost()        = 0;
    virtual ~Coffee() {}
};

class SimpleCoffee : public Coffee {
public:
    string getDescription() override { return "Simple Coffee"; }
    double getCost()        override { return 1.0; }
};

// Base decorator
class CoffeeDecorator : public Coffee {
protected:
    Coffee* wrapped;
public:
    CoffeeDecorator(Coffee* c) : wrapped(c) {}
};

class MilkDecorator : public CoffeeDecorator {
public:
    MilkDecorator(Coffee* c) : CoffeeDecorator(c) {}
    string getDescription() override { return wrapped->getDescription() + " + Milk"; }
    double getCost()        override { return wrapped->getCost() + 0.25; }
};

class SugarDecorator : public CoffeeDecorator {
public:
    SugarDecorator(Coffee* c) : CoffeeDecorator(c) {}
    string getDescription() override { return wrapped->getDescription() + " + Sugar"; }
    double getCost()        override { return wrapped->getCost() + 0.10; }
};


// ---- 8. FACADE — simple interface over complex subsystem ----
// Use case: home theater, payment gateways, startup systems

class CPU    { public: void start()  { cout << "CPU started\n"; } };
class Memory { public: void load()   { cout << "Memory loaded\n"; } };
class Disk   { public: void read()   { cout << "Disk reading\n"; } };

// Facade hides all the complexity
class ComputerFacade {
    CPU cpu; Memory mem; Disk disk;
public:
    void startComputer() {
        cout << "--- Starting Computer ---" << endl;
        cpu.start();
        mem.load();
        disk.read();
        cout << "Computer ready!" << endl;
    }
};


// ---- 9. PROXY — controls access to another object ----
// Use case: lazy loading, access control, logging, caching

class Image {
public:
    virtual void display() = 0;
    virtual ~Image() {}
};

class RealImage : public Image {
    string filename;
public:
    RealImage(string f) : filename(f) {
        cout << "Loading image from disk: " << filename << endl;
    }
    void display() override {
        cout << "Displaying: " << filename << endl;
    }
};

// Proxy: loads image lazily (only when needed)
class ImageProxy : public Image {
    string filename;
    RealImage* realImage = nullptr;
public:
    ImageProxy(string f) : filename(f) {}

    void display() override {
        if (!realImage)
            realImage = new RealImage(filename);  // load only on first use
        realImage->display();
    }

    ~ImageProxy() { delete realImage; }
};


// ============================================================
//  BEHAVIORAL PATTERNS
// ============================================================

// ---- 10. OBSERVER — notify multiple objects about state changes ----
// Use case: event systems, UI updates, Discord notifications!

class Observer {
public:
    virtual void update(const string& event) = 0;
    virtual ~Observer() {}
};

class Subject {
    vector<Observer*> observers;
public:
    void subscribe(Observer* o)   { observers.push_back(o); }
    void unsubscribe(Observer* o) {
        observers.erase(remove(observers.begin(), observers.end(), o), observers.end());
    }
    void notify(const string& event) {
        for (auto* o : observers) o->update(event);
    }
};

class DiscordChannel : public Subject {
    string name;
public:
    DiscordChannel(string n) : name(n) {}
    void newMessage(string msg) {
        cout << "[" << name << "] New message: " << msg << endl;
        notify(msg);
    }
};

class User : public Observer {
    string username;
public:
    User(string u) : username(u) {}
    void update(const string& event) override {
        cout << "  -> " << username << " got notification: " << event << endl;
    }
};


// ---- 11. STRATEGY — swap algorithms at runtime ----
// Use case: sorting strategies, payment methods, navigation routes

class SortStrategy {
public:
    virtual void sort(vector<int>& data) = 0;
    virtual ~SortStrategy() {}
};

class BubbleSort : public SortStrategy {
public:
    void sort(vector<int>& data) override {
        cout << "Sorting with Bubble Sort" << endl;
        int n = data.size();
        for (int i = 0; i < n-1; i++)
            for (int j = 0; j < n-i-1; j++)
                if (data[j] > data[j+1])
                    swap(data[j], data[j+1]);
    }
};

class QuickSort : public SortStrategy {
public:
    void sort(vector<int>& data) override {
        cout << "Sorting with Quick Sort" << endl;
        std::sort(data.begin(), data.end());  // simplified
    }
};

class Sorter {
    SortStrategy* strategy;
public:
    Sorter(SortStrategy* s) : strategy(s) {}

    void setStrategy(SortStrategy* s) { strategy = s; }  // swap at runtime!

    void sort(vector<int>& data) { strategy->sort(data); }
};


// ---- 12. COMMAND — encapsulate a request as an object ----
// Use case: undo/redo, task queues, transaction logs

class Command {
public:
    virtual void execute() = 0;
    virtual void undo()    = 0;
    virtual ~Command() {}
};

class TextEditor {
    string text;
public:
    void addText(string t) { text += t; cout << "Text: " << text << endl; }
    void removeText(int n) {
        if (n <= (int)text.size()) text = text.substr(0, text.size() - n);
        cout << "Text: " << text << endl;
    }
    string getText() { return text; }
};

class TypeCommand : public Command {
    TextEditor* editor;
    string typed;
public:
    TypeCommand(TextEditor* e, string t) : editor(e), typed(t) {}
    void execute() override { editor->addText(typed); }
    void undo()    override { editor->removeText(typed.size()); }
};


// ---- 13. TEMPLATE METHOD — define skeleton, let subclass fill details ----
// Use case: data parsers, game loops, report generators

class DataMiner {
public:
    // Template method — final skeleton that never changes
    void mine() {
        openFile();
        extractData();
        parseData();
        analyzeData();
        closeFile();
    }

    virtual void openFile()    = 0;  // subclass implements these
    virtual void extractData() = 0;
    virtual void parseData()   = 0;

    void analyzeData() { cout << "Analyzing data (same for all)" << endl; }
    void closeFile()   { cout << "Closing file" << endl; }

    virtual ~DataMiner() {}
};

class CSVMiner : public DataMiner {
public:
    void openFile()    override { cout << "Opening CSV file" << endl; }
    void extractData() override { cout << "Extracting CSV rows" << endl; }
    void parseData()   override { cout << "Parsing comma-separated values" << endl; }
};

class JSONMiner : public DataMiner {
public:
    void openFile()    override { cout << "Opening JSON file" << endl; }
    void extractData() override { cout << "Extracting JSON nodes" << endl; }
    void parseData()   override { cout << "Parsing JSON key-value pairs" << endl; }
};


// ---- 14. STATE — object changes behavior when state changes ----
// Use case: vending machine, traffic light, order status

class TrafficLight;

class LightState {
public:
    virtual void handle(TrafficLight* light) = 0;
    virtual string getColor() = 0;
    virtual ~LightState() {}
};

class TrafficLight {
    LightState* state;
public:
    TrafficLight(LightState* s) : state(s) {}
    void setState(LightState* s) { state = s; }
    void change()  { state->handle(this); }
    string color() { return state->getColor(); }
};

class RedLight : public LightState;
class GreenLight : public LightState;
class YellowLight : public LightState;

class RedLight : public LightState {
public:
    void handle(TrafficLight* light) override;
    string getColor() override { return "RED"; }
};

class GreenLight : public LightState {
public:
    void handle(TrafficLight* light) override;
    string getColor() override { return "GREEN"; }
};

class YellowLight : public LightState {
public:
    void handle(TrafficLight* light) override;
    string getColor() override { return "YELLOW"; }
};

void RedLight::handle(TrafficLight* light) {
    cout << "RED -> switching to GREEN" << endl;
    light->setState(new GreenLight());
}
void GreenLight::handle(TrafficLight* light) {
    cout << "GREEN -> switching to YELLOW" << endl;
    light->setState(new YellowLight());
}
void YellowLight::handle(TrafficLight* light) {
    cout << "YELLOW -> switching to RED" << endl;
    light->setState(new RedLight());
}


// ============================================================
// MAIN
// ============================================================
int main() {
    cout << "\n====== CREATIONAL PATTERNS ======\n" << endl;

    // Singleton
    cout << "--- Singleton ---" << endl;
    Logger::getInstance()->log("App started");
    Logger::getInstance()->log("Same instance used");

    // Factory
    cout << "\n--- Factory ---" << endl;
    Button* btn = ButtonFactory::create("Windows");
    btn->render();
    delete btn;

    // Builder
    cout << "\n--- Builder ---" << endl;
    Pizza p = PizzaBuilder()
                .setSize("Large")
                .setCrust("Thin")
                .setSauce("Tomato")
                .addTopping("Cheese")
                .addTopping("Mushrooms")
                .build();
    p.display();

    // Prototype
    cout << "\n--- Prototype ---" << endl;
    Goblin original(100, 20);
    Monster* clone = original.clone();
    clone->display();
    delete clone;

    cout << "\n====== STRUCTURAL PATTERNS ======\n" << endl;

    // Adapter
    cout << "--- Adapter ---" << endl;
    MediaPlayer* player = new AudioAdapter();
    player->play("mp3", "song.mp3");
    delete player;

    // Decorator
    cout << "\n--- Decorator ---" << endl;
    Coffee* coffee = new SimpleCoffee();
    coffee = new MilkDecorator(coffee);
    coffee = new SugarDecorator(coffee);
    cout << coffee->getDescription() << " = $" << coffee->getCost() << endl;
    delete coffee;

    // Facade
    cout << "\n--- Facade ---" << endl;
    ComputerFacade pc;
    pc.startComputer();

    // Proxy
    cout << "\n--- Proxy ---" << endl;
    Image* img = new ImageProxy("photo.jpg");
    cout << "Image created (not loaded yet)" << endl;
    img->display();  // loads now
    img->display();  // already loaded, no reload
    delete img;

    cout << "\n====== BEHAVIORAL PATTERNS ======\n" << endl;

    // Observer
    cout << "--- Observer ---" << endl;
    DiscordChannel channel("general");
    User u1("Alice"), u2("Bob");
    channel.subscribe(&u1);
    channel.subscribe(&u2);
    channel.newMessage("Hello everyone!");
    channel.unsubscribe(&u2);
    channel.newMessage("Bob left the channel");

    // Strategy
    cout << "\n--- Strategy ---" << endl;
    vector<int> data = {5, 2, 8, 1, 9};
    Sorter sorter(new BubbleSort());
    sorter.sort(data);
    sorter.setStrategy(new QuickSort());
    sorter.sort(data);

    // Command + Undo
    cout << "\n--- Command (with Undo) ---" << endl;
    TextEditor editor;
    TypeCommand* cmd1 = new TypeCommand(&editor, "Hello ");
    TypeCommand* cmd2 = new TypeCommand(&editor, "World");
    cmd1->execute();
    cmd2->execute();
    cmd2->undo();   // undo "World"
    delete cmd1; delete cmd2;

    // Template Method
    cout << "\n--- Template Method ---" << endl;
    CSVMiner csv;
    csv.mine();
    cout << endl;
    JSONMiner json;
    json.mine();

    // State
    cout << "\n--- State ---" << endl;
    TrafficLight light(new RedLight());
    for (int i = 0; i < 4; i++) {
        cout << "Current: " << light.color() << endl;
        light.change();
    }

    return 0;
}

/*
=============================================================================
  DESIGN PATTERNS CHEATSHEET — INTERVIEW READY
=============================================================================

CREATIONAL (HOW to create):
  Singleton       → 1 instance only               (Logger, Config, DB pool)
  Factory Method  → subclass decides which object  (cross-platform UI)
  Abstract Factory→ family of related objects      (UI toolkit — button+checkbox)
  Builder         → step-by-step complex object    (Pizza, SQL query)
  Prototype       → clone instead of new           (game objects, documents)

STRUCTURAL (HOW to compose):
  Adapter         → incompatible → compatible      (old API + new interface)
  Decorator       → add features dynamically       (coffee + milk + sugar)
  Facade          → simple interface to subsystem  (home theater, boot sequence)
  Proxy           → controlled access              (lazy load, access control)
  Composite       → tree structure (part-whole)    (file system, UI widgets)

BEHAVIORAL (HOW to communicate):
  Observer        → notify many on state change    (event system, Discord!)
  Strategy        → swap algorithms at runtime     (sorting, payment)
  Command         → request as object + undo       (editor, transaction)
  Template Method → skeleton + subclass details    (data miners, game loop)
  State           → behavior changes with state    (traffic light, vending)
  Iterator        → traverse collection uniformly  (STL iterators)
  Chain of Resp.  → pass request along a chain     (middleware, logging)

SOLID PRINCIPLES (often asked alongside patterns):
  S — Single Responsibility  → one class, one job
  O — Open/Closed            → open for extension, closed for modification
  L — Liskov Substitution    → subclass must work where parent is expected
  I — Interface Segregation  → don't force unused methods
  D — Dependency Inversion   → depend on abstractions, not concretions

=============================================================================
*/
