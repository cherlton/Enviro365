# 🦁 OOP Animal Exercise - Multi-File Project Guide

A dedicated guide for the **4 Pillars of Object-Oriented Programming (OOP)** in Java using an Animal domain. This guide shows how to organize code into **separate `.java` files** across a clean package structure.

---

## 📁 Ideal File Structure (Separate `.java` Files)

In a live-coding interview, creating separate `.java` files for each class demonstrates clean architecture and professional Java standards.

```text
src/
└── com/interview/animal/
     ├── Trainable.java       <-- Interface (Abstraction)
     ├── Animal.java          <-- Abstract Superclass (Encapsulation & Abstraction)
     ├── Dog.java             <-- Concrete Subclass (Inheritance & Polymorphism)
     ├── Cat.java             <-- Concrete Subclass (Inheritance & Polymorphism)
     └── AnimalApp.java       <-- Main Application Class (Runner with main() method)
```

---

## 💻 Separate File Implementation Code

### File 1: `Trainable.java` (Interface - Abstraction)

```java
package com.interview.animal;

/**
 * ABSTRACTION: Defines a contract for behavior without any implementation.
 */
public interface Trainable {
    void performTrick(String trickName);
}
```

---

### File 2: `Animal.java` (Abstract Class - Encapsulation & Abstraction)

```java
package com.interview.animal;

/**
 * ABSTRACTION & ENCAPSULATION:
 * Abstract base class that cannot be instantiated directly.
 * Encapsulates state using private fields and public getters/setters with validation.
 */
public abstract class Animal {

    // Encapsulated private fields
    private String name;
    private int age;

    // Constructor
    public Animal(String name, int age) {
        setName(name);
        setAge(age);
    }

    // Encapsulated Getters & Setters with defensive checks
    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Animal name cannot be empty");
        }
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
        this.age = age;
    }

    // Abstract method: Every subclass MUST provide its own implementation
    public abstract void makeSound();

    // POLYMORPHISM (Method Overloading - Compile Time)
    public void eat(String food) {
        System.out.println(name + " is eating " + food + ".");
    }

    public void eat(String food, int grams) {
        System.out.println(name + " is eating " + grams + "g of " + food + ".");
    }
}
```

---

### File 3: `Dog.java` (Concrete Class - Inheritance & Polymorphism)

```java
package com.interview.animal;

/**
 * INHERITANCE: Extends base class 'Animal' to inherit name and age.
 * POLYMORPHISM: Overrides 'makeSound()' method.
 * ABSTRACTION: Implements 'Trainable' interface.
 */
public class Dog extends Animal implements Trainable {

    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age); // Initialize parent fields
        this.breed = breed;
    }

    public String getBreed() {
        return breed;
    }

    // Polymorphism: Method Overriding (Runtime)
    @Override
    public void makeSound() {
        System.out.println(getName() + " the " + breed + " says: Woof! Woof! 🐶");
    }

    // Interface Method Implementation
    @Override
    public void performTrick(String trickName) {
        System.out.println(getName() + " executed trick: " + trickName + "! 🐕");
    }
}
```

---

### File 4: `Cat.java` (Concrete Class - Inheritance & Polymorphism)

```java
package com.interview.animal;

/**
 * INHERITANCE: Extends base class 'Animal'.
 * POLYMORPHISM: Overrides 'makeSound()'.
 */
public class Cat extends Animal {

    private boolean isIndoor;

    public Cat(String name, int age, boolean isIndoor) {
        super(name, age);
        this.isIndoor = isIndoor;
    }

    public boolean isIndoor() {
        return isIndoor;
    }

    @Override
    public void makeSound() {
        System.out.println(getName() + " says: Meow! Meow! 🐱");
    }
}
```

---

### File 5: `AnimalApp.java` (Main Entry Point Runner)

```java
package com.interview.animal;

/**
 * Main application runner class to test and demonstrate OOP principles.
 */
public class AnimalApp {

    public static void main(String[] args) {
        System.out.println("=== 1. POLYMORPHISM DEMO (Subclasses in Superclass Array) ===");
        
        // Polymorphic collection: Storing Dog and Cat inside an Animal array
        Animal[] animals = new Animal[] {
            new Dog("Buddy", 3, "Golden Retriever"),
            new Cat("Whiskers", 2, true)
        };

        for (Animal animal : animals) {
            // Polymorphic method call (invokes Dog.makeSound or Cat.makeSound dynamically)
            animal.makeSound();

            // Method Overloading demonstration
            animal.eat("Kibble");
            animal.eat("Kibble", 200);
            System.out.println();
        }

        System.out.println("=== 2. INTERFACE & ABSTRACTION DEMO ===");
        Trainable trainedDog = new Dog("Rex", 4, "German Shepherd");
        trainedDog.performTrick("Roll Over");
    }
}
```

---

## 🎯 Quick Key Explanations to Tell the Interviewer

1. **"Why use `abstract class Animal` instead of a regular class?"**  
   *"Because a generic 'Animal' doesn't exist in real life — only specific animals exist (Dog, Cat). `abstract` prevents creating `new Animal()`, enforcing instantiating concrete subclasses."*

2. **"Why `private` fields with `public` getters/setters?"**  
   *"This is Encapsulation. It prevents external classes from setting invalid state (like a negative age) by validating incoming data inside setters."*

3. **"What is the difference between Overloading and Overriding?"**  
   *"Overriding happens at runtime when a subclass (`Dog`) redefines a parent method (`makeSound()`). Overloading happens at compile time when a method name is reused with different parameter signatures (`eat(food)` vs `eat(food, grams)`)."*
