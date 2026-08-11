# ⚡ Data Structures Exercise - Multi-File Project Guide

A dedicated guide for **Data Structures (Arrays, Linked Lists, Stacks, Queues, HashMaps)** in Java. This guide shows how to organize data structure exercises into **separate `.java` files** across a clean package structure.

---

## 📁 Ideal File Structure (Separate `.java` Files)

```text
src/
└── com/interview/ds/
     ├── Node.java                   <-- Generic or integer Node element
     ├── CustomSinglyLinkedList.java <-- Custom LinkedList Data Structure Class
     ├── HashMapFrequencyDemo.java   <-- HashMap Word Frequency Utility Class
     ├── StackQueueDemo.java         <-- Stack & Queue Operations Class
     └── DataStructuresApp.java      <-- Main Entry Point Runner Class
```

---

## 💻 Separate File Implementation Code

### File 1: `Node.java` (LinkedList Node Data Container)

```java
package com.interview.ds;

/**
 * Node class representing a single element in a Singly Linked List.
 */
public class Node {
    public int data;
    public Node next;

    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}
```

---

### File 2: `CustomSinglyLinkedList.java` (Custom Linked List Data Structure)

```java
package com.interview.ds;

/**
 * Custom Singly Linked List implementation built from scratch.
 */
public class CustomSinglyLinkedList {

    private Node head;

    // Add to end of list - O(n) time
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

    // Add to front (Head) - O(1) time
    public void addFirst(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }

    // Reverse list in-place - O(n) time, O(1) space
    public void reverse() {
        Node previous = null;
        Node current = head;
        Node nextNode = null;

        while (current != null) {
            nextNode = current.next; // Save next
            current.next = previous; // Reverse link pointer
            previous = current;      // Advance previous
            current = nextNode;      // Advance current
        }
        head = previous;
    }

    // Print list elements
    public void printList() {
        Node current = head;
        System.out.print("Head -> ");
        while (current != null) {
            System.out.print("[" + current.data + "] -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}
```

---

### File 3: `HashMapFrequencyDemo.java` (Key-Value Lookup & Frequency Counter)

```java
package com.interview.ds;

import java.util.HashMap;
import java.util.Map;

/**
 * Demonstrates HashMap key-value lookups and O(n) frequency counting.
 */
public class HashMapFrequencyDemo {

    public static Map<String, Integer> countWordFrequencies(String sentence) {
        if (sentence == null || sentence.isEmpty()) {
            return new HashMap<>();
        }

        String[] words = sentence.split("\\s+");
        Map<String, Integer> counts = new HashMap<>();

        for (String word : words) {
            String cleanWord = word.toLowerCase();
            counts.put(cleanWord, counts.getOrDefault(cleanWord, 0) + 1);
        }

        return counts;
    }
}
```

---

### File 4: `StackQueueDemo.java` (LIFO vs. FIFO Operations)

```java
package com.interview.ds;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.LinkedList;
import java.util.Queue;

/**
 * Demonstrates Stack (LIFO) and Queue (FIFO) operations.
 */
public class StackQueueDemo {

    // Demonstrates Stack (LIFO: Last-In, First-Out)
    public static void runStackExample() {
        Deque<String> stack = new ArrayDeque<>();
        stack.push("Page 1 (Home)");
        stack.push("Page 2 (Products)");
        stack.push("Page 3 (Checkout)");

        System.out.println("Stack Top (Peek): " + stack.peek()); // Page 3
        System.out.println("Stack Pop: " + stack.pop());         // Removes Page 3
        System.out.println("Stack Current Top: " + stack.peek()); // Page 2
    }

    // Demonstrates Queue (FIFO: First-In, First-Out)
    public static void runQueueExample() {
        Queue<String> queue = new LinkedList<>();
        queue.offer("Customer 1");
        queue.offer("Customer 2");
        queue.offer("Customer 3");

        System.out.println("Queue Front (Peek): " + queue.peek());   // Customer 1
        System.out.println("Queue Poll (Dequeued): " + queue.poll()); // Removes Customer 1
        System.out.println("Queue Next Front: " + queue.peek());      // Customer 2
    }
}
```

---

### File 5: `DataStructuresApp.java` (Main Entry Point Runner)

```java
package com.interview.ds;

import java.util.Map;

/**
 * Main Application Runner class for Data Structures live coding.
 */
public class DataStructuresApp {

    public static void main(String[] args) {
        System.out.println("=== 1. CUSTOM LINKED LIST DEMO ===");
        CustomSinglyLinkedList list = new CustomSinglyLinkedList();
        list.add(10);
        list.add(20);
        list.add(30);
        list.addFirst(5);

        System.out.print("Original List: ");
        list.printList(); // Head -> [5] -> [10] -> [20] -> [30] -> null

        list.reverse();
        System.out.print("Reversed List: ");
        list.printList(); // Head -> [30] -> [20] -> [10] -> [5] -> null

        System.out.println("\n=== 2. HASHMAP FREQUENCY DEMO ===");
        String sampleText = "java spring boot java spring java";
        Map<String, Integer> frequencies = HashMapFrequencyDemo.countWordFrequencies(sampleText);
        
        frequencies.forEach((word, count) -> {
            System.out.println(word + " -> " + count);
        });

        System.out.println("\n=== 3. STACK & QUEUE DEMO ===");
        System.out.println("-- Stack (LIFO) --");
        StackQueueDemo.runStackExample();
        
        System.out.println("\n-- Queue (FIFO) --");
        StackQueueDemo.runQueueExample();
    }
}
```

---

## 📊 Big-O Complexity Quick Reference Matrix

| Operations | Array | Custom LinkedList | HashMap | Stack / Queue |
| :--- | :---: | :---: | :---: | :---: |
| **Access by Index** | $O(1)$ | $O(n)$ | N/A | N/A |
| **Search Element** | $O(n)$ | $O(n)$ | $O(1)$ average | $O(n)$ |
| **Insertion at Start** | $O(n)$ | $O(1)$ | $O(1)$ average | $O(1)$ |
| **Insertion at End** | $O(1)^*$ | $O(n)$ | $O(1)$ average | $O(1)$ |
| **Deletion** | $O(n)$ | $O(1)$ at head | $O(1)$ average | $O(1)$ |
