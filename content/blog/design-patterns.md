---
external: false
title: "Design Patterns"
description: "Design Patterns Notes"
date: 2024-07-11
---

# Principles
S - Single-responsibility Principle
O - Open-closed Principle
L - Liskov Substitution Principle
I - Interface Segregation Principle
D - Dependency Inversion Principle


# Types
- Creational
- Structural
- Behavioral

# Creational
## Factory
A **factory** is an abstraction—realized as a method, function, or dedicated object—whose sole responsibility is to encapsulate the instantiation and configuration of objects, returning them typed as a common abstraction (an interface or abstract class) so that client code remains decoupled from concrete classes and direct constructor invocations.

---

### Technical Invariants of a Factory

A creational mechanism qualifies as a factory if it enforces these technical properties:

1. **Encapsulation of Instantiation:**
It isolates constructor calls (`new ConcreteType()`), memory allocation, and complex initialization logic away from the call site. The client never references the concrete implementation's constructor.
2. **Subtype Polymorphism:**
The declared return type of the creation routine is a supertype (an abstract class or interface). At runtime, the method returns an instance of a compatible subtype that satisfies the Liskov Substitution Principle (LSP).
3. **Inversion of Concrete Dependencies:**
It enforces the Dependency Inversion Principle (DIP): high-level modules depend on abstractions (the returned interface), not on concrete details (the specific subclass instantiated).
4. **Dynamic Selection & Lifecycle Control:**
The factory retains the authority to determine *which* subtype to instantiate at runtime (via configuration, parameters, or environment variables) and *how* to fulfill it (e.g., returning a fresh instance, pulling from an object pool, or returning a cached/flyweight instance).

---

### The Three Technical Forms

Depending on the architectural level, the term "factory" refers to one of three distinct constructs:

* **Simple Factory (Static Factory Idiom):**
A non-polymorphic class or static method containing conditional logic (e.g., a `switch` statement or map registry) that evaluates inputs and returns a concrete subtype disguised as a common supertype.
*(Example: `BorderFactory.createEmptyBorder()`, `Integer.valueOf(String)`)*
* **Factory Method (GoF Creational Pattern):**
An architectural pattern that relies on **inheritance**. A creator class declares an abstract or overridable method (`createProduct()`), delegating the decision of which concrete subtype to instantiate to derived subclasses.
*(Example: `ILoggerFactory.getLogger()`, framework hook methods)*
* **Abstract Factory (GoF Creational Pattern):**
An architectural pattern that relies on **composition**. An interface declares a set of distinct factory methods designed to produce an entire suite of related abstract products, guaranteeing cross-product compatibility.
*(Example: `java.sql.Connection` creating `Statement`, `PreparedStatement`, and `Blob`)*

## Abstract Factory
An **Abstract Factory** is an architectural creational pattern that provides an interface for producing families of related or dependent objects without specifying or coupling client code to their concrete classes.

Unlike a standard Factory Method—which encapsulates the instantiation of a single product hierarchy—an Abstract Factory uses **object composition** to bind together multiple distinct factory methods into a cohesive unit, guaranteeing that the returned products are mutually compatible.

---

### Technical Invariants of an Abstract Factory

An architectural component qualifies as an Abstract Factory if it enforces these properties:

1. **Family-Level Cohesion (Multi-Product Contract):**
The factory interface declares two or more distinct creation methods, each returning a completely different abstract product type (e.g., `createStorage() -> BlobStorage`, `createQueue() -> MessageQueue`). These products are functionally distinct but structurally or environmentally interdependent.
2. **Cross-Product Compatibility Enforcement:**
The pattern enforces an architectural invariant: **products from different families cannot be mixed**. Because a concrete factory produces all objects for a given platform, theme, or vendor, client code is structurally prevented from combining incompatible components (such as an AWS storage client with an Azure authentication token, or a PostgreSQL statement with a MySQL connection).
3. **Composition-Based Client Decoupling:**
The client does not subclass the factory; it receives a reference to the `AbstractFactory` interface via dependency injection or composition. The client calls the various creation methods on that single factory instance to obtain its working ecosystem of products.
4. **Two-Dimensional Extensibility Asymmetry:**
The design exhibits a specific architectural trade-off regarding the Open-Closed Principle (OCP):
* **Open for new families:** Adding a new vendor, theme, or operating system variant requires only adding a new `ConcreteFactory` class without modifying existing client code or interfaces.
* **Closed (rigid) for new products:** Introducing an entirely new product type requires modifying the `AbstractFactory` interface, which cascades breaking changes across all existing concrete factory implementations.



---

### Formal GoF Participants

* **`AbstractFactory`:** The supertype (interface or abstract class) declaring a set of creation signatures:

$$\text{createProductA}() \to \text{AbstractProductA}$$


$$\text{createProductB}() \to \text{AbstractProductB}$$


* **`ConcreteFactory`:** The implementation that instantiates specific, matching concrete classes:

$$\text{ConcreteFactory}_1 \implies \text{ConcreteProductA}_1, \, \text{ConcreteProductB}_1$$


$$\text{ConcreteFactory}_2 \implies \text{ConcreteProductA}_2, \, \text{ConcreteProductB}_2$$


* **`AbstractProduct` (Family Members):** The independent supertypes defining the specifications for each distinct role in the suite.
* **`ConcreteProduct`:** The vendor- or platform-specific implementations of each abstract product.
* **`Client`:** The consuming domain module that interacts exclusively with the `AbstractFactory` and `AbstractProduct` contracts, remaining completely agnostic to which concrete family is executing at runtime.

## Builder Pattern
The Builder pattern is an architectural creational pattern that separates the step-by-step construction of a complex object from its final representation, allowing the same construction process to produce different configurations and representations.

While Factory patterns focus on instantiating an object in a single operation—often deciding which subtype to create—the Builder pattern focuses on how a single, complex object is assembled over time through an incremental series of configuration steps.

## Prototype Pattern


The **Prototype pattern** is a creational design pattern where new objects are produced by **cloning an existing instance (the prototype)** rather than creating new instances from scratch through constructors or factories.

Yes, it is fully applicable to Java, but Java has a unique and notorious history with it: while the language has built-in mechanisms (`Cloneable` and `Object.clone()`) designed specifically for this pattern, the native mechanism is widely considered flawed, leading modern Java developers to implement the pattern using cleaner, safer alternatives.

---

### Core Technical Invariants of the Prototype Pattern

1. **Delegated Self-Duplication:**
The object itself handles its own replication via a method like `clone()` or `copy()`. This allows a client to duplicate an object without knowing its concrete class or private internal fields.
2. **Bypassing Expensive Construction:**
Instead of repeating expensive computations, network fetches, or database queries to construct an object, the system initializes one baseline prototype and clones it whenever an additional instance is needed.
3. **Decoupling from Concrete Types:**
The client interacts strictly with an abstract interface declaring the duplication method:

$$\text{prototype}.\text{clone}() \to \text{Prototype}$$



---

### The Java Problem: Why `java.lang.Cloneable` Is Broken

Java attempted to build native support for the Prototype pattern into its standard library, but the implementation introduced major design flaws that Joshua Bloch famously detailed in *Effective Java*:

```java
// How the JDK attempted it:
public class BadExample implements Cloneable {
    private String name;
    private List<String> permissions;

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone(); // Native shallow field-by-field copy
    }
}

```

The native Java mechanism creates four distinct problems:

1. **Interface Contract Violation:** `java.lang.Cloneable` is a marker interface containing **zero methods**. The actual `clone()` method is defined as `protected` on `java.lang.Object`. Implementing `Cloneable` simply flips an internal JVM flag to allow `super.clone()` to execute without throwing a `CloneNotSupportedException`.
2. **Bypasses Constructors:** `super.clone()` creates an object in memory via low-level JVM memory allocation without calling any constructor. This circumvents constructor-based invariants, validations, and security checks.
3. **Shallow Copy by Default:** `super.clone()` only performs a shallow bitwise copy of object references. In the example above, both the clone and original share the exact same `permissions` list reference. Mutating the list in the clone silently corrupts the original object.
4. **Final Fields Conflict:** If you make fields `final` to ensure immutability, `clone()` cannot reassign deep-copied versions of those fields.

---

### How to Implement Prototype in Modern Java

In production Java, the Prototype pattern is implemented in one of three idiomatic ways.

#### 1. Custom Prototype Interface (Pure GoF Pattern)

Define a generic, type-safe interface that explicitly handles deep cloning without relying on `Object.clone()`:

```java
// 1. Prototype Interface
public interface Prototype<T> {
    T copy();
}

// 2. Concrete Prototype
public class ServerConfiguration implements Prototype<ServerConfiguration> {
    private String host;
    private int port;
    private Map<String, String> headers;

    public ServerConfiguration(String host, int port, Map<String, String> headers) {
        this.host = host;
        this.port = port;
        this.headers = new HashMap<>(headers);
    }

    @Override
    public ServerConfiguration copy() {
        // Enforce true deep-copying and valid construction
        Map<String, String> clonedHeaders = new HashMap<>(this.headers);
        return new ServerConfiguration(this.host, this.port, clonedHeaders);
    }

    public void setPort(int port) { this.port = port; }
}

// 3. Client Usage
ServerConfiguration baseline = new ServerConfiguration("10.0.0.1", 8080, Map.of("Auth", "Bearer-xyz"));

// Clone the prototype and modify only what varies
ServerConfiguration workerNode = baseline.copy();
workerNode.setPort(8081);

```

#### 2. Copy Constructors / Copy Factories (The Effective Java Standard)

This is the most common industry replacement for `Cloneable`. The class provides a constructor or static factory method that accepts an instance of itself:

```java
public class UserSession {
    private final String userId;
    private final Set<String> roles;

    // Standard constructor
    public UserSession(String userId, Set<String> roles) {
        this.userId = userId;
        this.roles = new HashSet<>(roles);
    }

    // Copy Constructor (Prototype Implementation)
    public UserSession(UserSession source) {
        this.userId = source.userId;
        this.roles = new HashSet<>(source.roles); // Deep copy of mutable collection
    }

    // Copy Factory Method
    public static UserSession newInstance(UserSession source) {
        return new UserSession(source);
    }
}

```

#### 3. Deep Cloning via Serialization / JSON

When dealing with deep, complex object graphs with nested lists, maps, and domain entities, manual deep copying becomes tedious and error-prone. Java developers frequently implement prototyping via serialization libraries (like Jackson or Gson):

```java
public class DeepCloner {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static <T> T deepCopy(T source, Class<T> clazz) {
        try {
            byte[] bytes = MAPPER.writeValueAsBytes(source);
            return MAPPER.readValue(bytes, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to clone prototype", e);
        }
    }
}

```

---

### When to Use Prototype in Java

* **High-Cost Initialization:** When an object requires an expensive database query, disk I/O, or cryptographic computation to construct, keep one initialized instance in memory and clone it on demand.
* **Complex Template Variants:** In gaming, simulation, or batch pipelines where hundreds of entities share 95% of the same state (e.g., an `EnemySpawner` cloning a pre-configured `OrcWarrior` prototype with slightly adjusted HP).
* **Snapshotting & Undo Buffers:** Creating isolated snapshots of an active state before executing operations that might need to be rolled back.


The **Singleton pattern** is a creational design pattern that ensures a class has **only one instance** throughout an application's lifecycle while providing a global point of access to that instance.

Along with Factory, Abstract Factory, Builder, and Prototype, it completes the five canonical Gang of Four (GoF) creational patterns. In Java, however, it is uniquely scrutinized because naive implementations break easily under concurrency, reflection, and serialization.

---

### Technical Invariants of a Singleton

1. **Controlled, Private Instantiation:**
The class's constructors are private to prevent direct instantiation via the `new` keyword from any outside class.
2. **Static Self-Reference:**
The class maintains a `private static` reference to its single instantiated self.
3. **Global Access Point:**
Access is provided strictly via a `public static` method (typically `getInstance()`), which controls when the instance is created (eager vs. lazy) and returns the existing reference on subsequent calls.
4. **Thread-Safe Lifecycle:**
In concurrent environments, multiple threads calling `getInstance()` concurrently must never result in multiple instances being allocated.

---

### Idiomatic Java Implementations

Over the years, Java developers moved away from basic synchronized methods due to locking overhead. The three production-grade approaches are:

#### 1. The Bill Pugh Singleton (Initialization-on-Demand Holder)

This is the cleanest approach for **lazy initialization** in pure Java. It leverages the JVM's class-loader mechanics: inner static classes are not loaded into memory until they are explicitly referenced.

```java
public class ConnectionPool {

    // 1. Private constructor prevents direct instantiation
    private ConnectionPool() {
        // Guard against reflection attack (explained below)
        if (InstanceHolder.INSTANCE != null) {
            throw new IllegalStateException("Already initialized");
        }
    }

    // 2. Static nested class loaded ONLY when getInstance() is called
    private static class InstanceHolder {
        private static final ConnectionPool INSTANCE = new ConnectionPool();
    }

    // 3. Thread-safe without explicit 'synchronized' blocks
    public static ConnectionPool getInstance() {
        return InstanceHolder.INSTANCE;
    }
}

```

* **Why it works:** The Java Virtual Machine specification guarantees that class initialization (the static block/fields of `InstanceHolder`) is serialized and thread-safe. You get lazy loading without locking overhead.

---

#### 2. Double-Checked Locking (DCL)

Used when parameters must be passed during initialization or when working with legacy code. It minimizes synchronization overhead by checking for null before and after acquiring a lock.

```java
public class CacheRegistry {
    // Crucial: volatile prevents instruction reordering by JVM/CPU
    private static volatile CacheRegistry instance;

    private CacheRegistry() {}

    public static CacheRegistry getInstance() {
        // First check (no locking overhead)
        if (instance == null) {
            synchronized (CacheRegistry.class) {
                // Second check (inside critical section)
                if (instance == null) {
                    instance = new CacheRegistry();
                }
            }
        }
        return instance;
    }
}

```

* **Why `volatile` is mandatory:** Creating an object in Java is not atomic. It involves:
1. Allocating memory.
2. Running the constructor to initialize fields.
3. Pointing the `instance` variable to that memory address.
Without `volatile`, compilers and CPUs can reorder steps 2 and 3. Another thread could see `instance != null` before constructor execution finishes, returning a half-initialized, corrupted object.



---

#### 3. Enum Singleton (The Effective Java Standard)

In *Effective Java*, Joshua Bloch states that **a single-element enum type is often the best way to implement a Singleton**.

```java
public enum AppConfiguration {
    INSTANCE;

    private String environment = "PRODUCTION";

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }
}

// Client usage:
AppConfiguration.INSTANCE.getEnvironment();

```

* **Why it is indestructible:** The JVM guarantees that enum values are instantiated exactly once per classloader, thread-safely, and are inherently immune to reflection attacks and serialization duplication.

---

### How Singletons Get Broken in Java (And How to Defend)

Traditional class-based Singletons can be bypassed through three JVM features:

| Vulnerability | How It Breaks the Singleton | How to Prevent It |
| --- | --- | --- |
| **Reflection** | `Constructor.setAccessible(true)` can invoke a private constructor to create a 2nd instance. | Throw an exception inside the constructor if an instance already exists. |
| **Serialization** | Deserializing a byte stream creates an entirely new object in memory without calling constructors. | Implement the `protected Object readResolve()` hook and return `getInstance()`. |
| **Multiple ClassLoaders** | If two classloaders load the same class (e.g., in OSGi or legacy EAR deployments), each gets its own static variable. | Bind the singleton lifecycle to the application's root classloader or use an IoC container. |

---

### The Modern Reality: Pattern vs. Container Scope

In modern enterprise architectures (Spring Boot, Quarkus, Micronaut), writing manual GoF Singleton classes is widely considered an **anti-pattern**:

* **Hidden Dependencies:** Calling `MyService.getInstance().doWork()` inside business logic creates tight coupling and hides dependencies from the class contract.
* **Testing Nightmare:** Global static state cannot be easily mocked, reset, or run in parallel across isolated unit tests.
* **Single Responsibility Violation:** The class manages its business logic *and* its own lifecycle/thread safety.

Instead, modern systems decouple the lifecycle from the class using **Singleton Scope** in a Dependency Injection (DI) container:

```java
// The class is written as a standard POJO with a public constructor
@Service
public class OrderService {
    // Easily mockable and injectable in unit tests: new OrderService()
}

```

The DI container (like Spring's `ApplicationContext`) takes responsibility for creating only one instance and passing it wherever required. The class remains clean, testable, and completely unaware that it is being used as a singleton.

