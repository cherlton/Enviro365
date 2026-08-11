# 🦁 Java OOP & Data Structures Live-Coding Interview Guide

A comprehensive, live-code-ready guide covering the **4 Pillars of Object-Oriented Programming (OOP)** with an Animal Domain model, **Data Structures** (Arrays vs. Linked Lists, Stacks, Queues, HashMaps), and **Project Organization** best practices for technical interviews.

---

## 1. 🧩 The 4 Pillars of OOP (Animal Kingdom Example)

Here is a complete, runnable Java example demonstrating **Encapsulation**, **Inheritance**, **Polymorphism**, and **Abstraction** in a single animal hierarchy.

### 🏛️ The 4 Pillars Explained:

1. **Abstraction**: Hiding internal implementation details and exposing only essential contracts using `abstract` classes or `interface`s (e.g., `abstract class Animal` and `interface Trainable`).
2. **Encapsulation**: Restricting direct access to object state by keeping fields `private` and exposing public getter/setter methods with validation logic.
3. **Inheritance**: Reusing code by allowing a subclass (`Dog`, `Cat`) to derive state and behavior from a parent superclass (`Animal`) using `extends`.
4. **Polymorphism**: The ability for an object to take many forms.
   - **Method Overriding (Runtime Polymorphism)**: Subclasses provide custom implementations of parent methods (`makeSound()`).
   - **Method Overloading (Compile-time Polymorphism)**: Same method name with different parameter signatures (`eat(String food)` vs `eat(String food, int quantity)`).

---

### 💻 Complete Runnable Java OOP Code

```java
// ==========================================
// 1. ABSTRACTION & INTERFACE
// ==========================================
interface Trainable {
    void performTrick(String trickName);
}

// Abstract Class: Cannot be instantiated directly
abstract class Animal {
    // 2. ENCAPSULATION: Private fields
    private String name;
    private int age;

    // Constructor
    public Animal(String name, int age) {
        setName(name);
        setAge(age);
    }

    // Encapsulated Getters and Setters with Validation
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

    // Abstract method (must be overridden by concrete subclasses)
    public abstract void makeSound();

    // 4. POLYMORPHISM (Method Overloading - Compile time)
    public void eat(String food) {
        System.out.println(name + " is eating " + food + ".");
    }

    public void eat(String food, int grams) {
        System.out.println(name + " is eating " + grams + "g of " + food + ".");
    }
}

// ==========================================
// 3. INHERITANCE & POLYMORPHISM (Method Overriding)
// ==========================================
class Dog extends Animal implements Trainable {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age); // Call superclass constructor
        this.breed = breed;
    }

    public String getBreed() { return breed; }

    // Overriding abstract method from Animal
    @Override
    public void makeSound() {
        System.out.println(getName() + " the " + breed + " says: Woof! Woof! 🐶");
    }

    // Implementing interface method
    @Override
    public void performTrick(String trickName) {
        System.out.println(getName() + " successfully performed the trick: " + trickName + "! 🐕");
    }
}

class Cat extends Animal {
    private boolean isIndoor;

    public Cat(String name, int age, boolean isIndoor) {
        super(name, age);
        this.isIndoor = isIndoor;
    }

    @Override
    public void makeSound() {
        System.out.println(getName() + " says: Meow! Meow! 🐱");
    }
}

// ==========================================
// MAIN EXECUTION CLASS
// ==========================================
public class OopDemoMain {
    public static void main(String[] args) {
        // Polymorphic Array: Storing Dog and Cat inside an Animal array
        Animal[] animals = new Animal[] {
            new Dog("Buddy", 3, "Golden Retriever"),
            new Cat("Whiskers", 2, true)
        };

        System.out.println("--- POLYMORPHISM IN ACTION ---");
        for (Animal animal : animals) {
            // Polymorphic method invocation (calls Dog.makeSound() or Cat.makeSound() at runtime)
            animal.makeSound(); 
            
            // Method Overloading demonstration
            animal.eat("Kibble");
            animal.eat("Kibble", 250);
            System.out.println();
        }

        System.out.println("--- INTERFACE DEMO ---");
        Trainable trainedDog = new Dog("Rex", 4, "German Shepherd");
        trainedDog.performTrick("Roll Over");
    }
}
```

---

## 2. ⚡ Data Structures: Arrays vs. Linked Lists & Core Concepts

### 📊 Quick Comparison Matrix

| Data Structure | Access Time | Insertion (Start) | Insertion (End) | Deletion | Memory Layout | Best Used For |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **Array (`int[]`)** | $O(1)$ | $O(n)$ | $O(1)^*$ | $O(n)$ | Contiguous Memory block | Known fixed size, fast index lookups |
| **ArrayList** | $O(1)$ | $O(n)$ | $O(1)$ amortized | $O(n)$ | Dynamic Resizing Array | General purpose list operations |
| **LinkedList** | $O(n)$ | $O(1)$ | $O(1)$ | $O(1)^*$ | Scattered Node pointers | Frequent additions/deletions at start/end |
| **Stack** | $O(n)$ | $O(1)$ (push) | N/A | $O(1)$ (pop) | LIFO (Last-In, First-Out) | Undo history, call stack, parenthesis matching |
| **Queue** | $O(n)$ | $O(1)$ (enqueue) | N/A | $O(1)$ (dequeue)| FIFO (First-In, First-Out) | Task scheduling, breadth-first search |
| **HashMap** | $O(1)$ avg | $O(1)$ avg | $O(1)$ avg | $O(1)$ avg | Hash buckets array + linked nodes | Key-Value lookups, caching, counting frequencies |

---

### 🔗 Live-Coding: Custom Singly Linked List Implementation

Interviewers frequently ask you to code a **Custom LinkedList from scratch** without using `java.util.LinkedList`.

```java
public class CustomSinglyLinkedList {

    // Inner Node Class
    private static class Node {
        int data;
        Node next;

        Node(int data) {
            this.data = data;
            this.next = null;
        }
    }

    private Node head;

    // 1. Add element to end of list - O(n)
    public void add(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            return;
        }
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }

    // 2. Add element to front (Head) - O(1)
    public void addFirst(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }

    // 3. Reverse the Linked List in-place - O(n) time, O(1) space
    public void reverse() {
        Node previous = null;
        Node current = head;
        Node nextNode = null;

        while (current != null) {
            nextNode = current.next; // Store next
            current.next = previous; // Reverse current node's pointer
            previous = current;      // Move previous one step forward
            current = nextNode;      // Move current one step forward
        }
        head = previous;
    }

    // 4. Print list contents
    public void printList() {
        Node current = head;
        System.out.print("Head -> ");
        while (current != null) {
            System.out.print("[" + current.data + "] -> ");
            current = current.next;
        }
        System.out.println("null");
    }

    public static void main(String[] args) {
        CustomSinglyLinkedList list = new CustomSinglyLinkedList();
        list.add(10);
        list.add(20);
        list.add(30);
        list.addFirst(5);

        System.out.print("Original List: ");
        list.printList(); // Output: Head -> [5] -> [10] -> [20] -> [30] -> null

        list.reverse();
        System.out.print("Reversed List: ");
        list.printList(); // Output: Head -> [30] -> [20] -> [10] -> [5] -> null
    }
}
```

---

### 🗺️ Live-Coding: HashMap Usage & Frequency Counter

Interviewers love testing HashMap key-value lookups:

```java
import java.util.HashMap;
import java.util.Map;

public class HashMapDemo {
    public static void main(String[] args) {
        String sentence = "apple banana apple orange banana apple";
        String[] words = sentence.split(" ");

        // Frequency counter using HashMap - O(n) time
        Map<String, Integer> wordCounts = new HashMap<>();

        for (String word : words) {
            wordCounts.put(word, wordCounts.getOrDefault(word, 0) + 1);
        }

        System.out.println("Word Frequency Count:");
        for (Map.Entry<String, Integer> entry : wordCounts.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}
```

---

## 3. 🏗️ Recommended Project Structure for Live-Coding Interviews

When setting up a standalone Java live-coding project in IntelliJ or VS Code, use a clean, package-based folder layout:

```text
my-live-coding-practice/
 ├── .gitignore
 ├── README.md
 └── src/
      └── com/
           └── interview/
                ├── model/             # OOP Classes (Animal.java, Dog.java, Cat.java)
                ├── ds/                # Data Structures (CustomLinkedList.java, StackDemo.java)
                ├── algorithm/         # Sorting & Binary Search algorithms
                └── Main.java          # Single entry point to run demonstrations
```

### 💡 Live Coding Best Practices:
1. **Talk out loud**: Explain *why* you are choosing a data structure before typing (`"I'm using a HashMap here because we need O(1) average lookup time..."`).
2. **Validate inputs**: Check for `null` or edge cases (empty list, single element) to show production-quality thinking.
3. **Mention Time/Space Complexity**: Conclude code implementations by stating the Big-O time and space complexity explicitly.
