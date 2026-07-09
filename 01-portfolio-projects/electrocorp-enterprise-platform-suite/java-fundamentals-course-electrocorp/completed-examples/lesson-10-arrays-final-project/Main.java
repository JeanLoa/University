class Persona {
    String nombre;
    int edad;

    Persona(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
}

public class Main {
    public static void main(String[] args) {
        Persona[] personas = {
            new Persona("Ana", 15),
            new Persona("Luis", 16),
            new Persona("Maria", 14)
        };

        for (int i = 0; i < personas.length; i++) {
            System.out.println("Registro " + (i + 1));
            System.out.println("Nombre: " + personas[i].nombre);
            System.out.println("Edad: " + personas[i].edad);
            System.out.println("--------------------");
        }
    }
}
