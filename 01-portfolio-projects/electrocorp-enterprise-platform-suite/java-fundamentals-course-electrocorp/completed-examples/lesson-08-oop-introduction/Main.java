class Persona {
    String nombre;
    int edad;

    Persona(String _nombre, int _edad) {
        this.nombre = _nombre;
        this.edad = _edad;
    }
}

public class Main
{
    public static void main(String[] args) {
        Persona persona1 = new Persona("Juanito", 19);

        persona1.nombre = "Sebastian";
        persona1.edad = 18;

        System.out.println("Tu nombre es: " + persona1.nombre + " y tu edad es: " + persona1.edad);
    }
}
