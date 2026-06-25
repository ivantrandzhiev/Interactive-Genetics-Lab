# Interactive-Genetics-Lab
Interactive SUICA-based genetics lesson for visualizing inheritance of traits through a simplified parent-child model.

👉 [Live Demo](https://ivantrandzhiev.github.io/Interactive-Genetics-Lab/Project/)

🎓 Created as part of the course:

**“Creating Interactive Educational Content”**  
Sofia University **“St. Kliment Ohridski”**

# About

**Interactive-Genetics-Lab** is a web-based educational project that demonstrates the inheritance of traits through a simplified genetics model.

The project combines theoretical explanations with a visual 3D laboratory, where users can create random parents, move them into a crossing zone, and generate a child whose traits are inherited from the parents.

This project was developed as part of an educational task using **HTML**, **CSS**, **JavaScript**, and the JS library **SUICA**.

---

# 🧬 What this project is

This project represents an interactive lesson about basic genetics and inheritance.

It explains key biological concepts such as:

* genetics;
* heredity;
* variability;
* DNA;
* genes;
* alleles;
* genotype;
* phenotype;
* dominant and recessive traits;
* inheritance of traits from parents to offspring.

The interactive part allows users to observe how different traits can be passed from two parents to their child through a simplified genetic model.

---

# 🎮 Interactive Laboratory

The project contains a 3D SUICA laboratory with two parent figures and a crossing zone.

The user can:

* generate random parents;
* drag Parent A and Parent B inside the crossing zone;
* create a child when both parents are in the zone;
* observe the child’s inherited traits;
* compare the traits of the parents and the child.

The simulation is simplified, but it helps visualize the relationship between genotype and phenotype in an accessible way.

---

# ✨ Main Features

* Interactive educational page about genetics;
* 3D visualization using SUICA;
* Random generation of parent traits;
* Drag-and-drop interaction with parent models;
* Crossing zone for creating offspring;
* Inheritance of alleles from both parents;
* Visualization of inherited traits in the child;
* Display of genotype and phenotype information;
* Educational tasks for observation and comparison.

---

# 🧠 Genetic Model

The simulation uses a simplified Mendelian inheritance model.

Each trait has:

* a dominant allele;
* a recessive allele;
* a genotype made of two alleles;
* a phenotype that shows the visible trait.

Example:

```text
Bb
```

In this example, `B` is a dominant allele and `b` is a recessive allele. Since the dominant allele is present, the dominant phenotype is expressed.

When a child is created, the program randomly selects one allele from each parent for every trait.

---

# 🧍 Visual Representation

The inherited traits are also connected to the visual appearance of the 3D characters.

For example:

* hair genotype affects hair color;
* eye genotype affects eye color;
* skin genotype affects skin color;
* height genotype affects the character’s height;
* body type genotype affects the body proportions.

This makes the simulation more visual and easier to understand.

---

# 🎮 Controls

| Action               | Control                             |
| -------------------- | ----------------------------------- |
| Generate new parents | Random Parents button               |
| Move parent models   | Drag with mouse                     |
| Create child         | Create Child button                 |
| View traits          | Trait panels                        |
| Compare inheritance  | Parent and Child information panels |

The **Create Child** button becomes active only when both parents are placed inside the crossing zone.

---

# 📚 Lesson Structure

The page is divided into several main sections:

## I. Theory

Introduces the basic concepts of genetics, heredity, DNA, genes, alleles, genotype, phenotype, and dominant/recessive traits.

## II. Interactive Laboratory

Contains the SUICA 3D scene where the inheritance simulation takes place.

## III. Controls

Contains buttons for generating parents and creating a child, as well as information panels for Parent A, Parent B, and the Child.

## IV. Tasks

Contains educational tasks that encourage users to create multiple children, observe their traits, and analyze which phenotypes appear more often.

---

# 🛠️ Technologies Used

The project is built with:

* **HTML** – structure of the educational page;
* **CSS** – styling, layout and responsive design;
* **JavaScript** – inheritance logic and interaction;
* **SUICA** – 3D visualization and interactive scene.

No external installation is required.

---

# 📁 Project Structure

```text
.
├── index.html
├── style.css
├── script.js
└── suica.js
```

## `index.html`

Contains the structure of the page, including the theory section, SUICA laboratory, controls, trait panels and tasks.

## `style.css`

Contains the visual design of the project, including the background, cards, buttons, panels and task layout.

## `script.js`

Contains the main simulation logic:

* random generation of genotypes;
* phenotype calculation;
* inheritance of alleles;
* creation of parent and child models;
* drag-and-drop interaction;
* update of trait information;
* SUICA scene management.

## `suica.js`

Contains the SUICA library used for the 3D visualization.

---

# 🎯 Educational Purpose

The purpose of this project is to help students understand how traits can be inherited from parents to offspring.

Through the simulation, users can observe:

* how genotype determines phenotype;
* how dominant and recessive alleles work;
* how each parent contributes one allele;
* how different combinations produce different traits;
* how inheritance can be represented visually.

The project is intended as a simple interactive learning tool rather than a fully realistic biological model.

---

# 👤 Author

Ivan Trandzhiev

Faculty of Mathematics and Informatics
Sofia University “St. Kliment Ohridski”

---

# 📄 License

This project is created for educational purposes.
