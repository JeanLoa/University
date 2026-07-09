public class Main {
    public static void main(String[] args) {
        saludarEstudiante("Diego");

        int resultado = calcularDoble(8);
        System.out.println("El doble es: " + resultado);
    }

    public static void saludarEstudiante(String nombre) {
        System.out.println("Hola, " + nombre + ". Bienvenido a Java.");
    }

    public static int calcularDoble(int numero) {
        return numero * 2;
    }
}
