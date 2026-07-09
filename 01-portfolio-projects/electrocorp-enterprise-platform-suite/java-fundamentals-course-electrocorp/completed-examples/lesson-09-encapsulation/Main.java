class Persona {
    private String nombre;
    private int edad;

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public String getNombre() {
        return nombre;
    }

    public int getEdad() {
        return edad;
    }
}

public class Main
{
    public static void main(String[] args) {
        Persona persona1 = new Persona();

        persona1.setNombre("Sebastian");

        persona1.setEdad(18);

        System.out.println("Nombre: " + persona1.getNombre());

        System.out.println("Edad: " + persona1.getEdad());
    }
}
