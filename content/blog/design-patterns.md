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
