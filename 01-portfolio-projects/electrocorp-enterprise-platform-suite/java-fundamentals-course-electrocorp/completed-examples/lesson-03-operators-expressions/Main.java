
public class Main
{
	public static void main(String[] args) {
	    
	    String nombre = "Pepito";
	    String apellido = "Perez";
	    int notaUno = 12;
	    int notaDos = 18;
	    boolean limpiezaCasa = true;
	    
	    String nombreCompleto = nombre + " " + apellido;
	    int promedio = (notaUno + notaDos)/2;
	    String resultado = (promedio>=11) ? "Aprobado" : "Desaprobado";
	    boolean salidaAmigos = (resultado == "Aprobado") && (limpiezaCasa=true);
	    
		System.out.println("Nombre Completo:" + nombreCompleto);
		System.out.println("Su promedio es: " + promedio);
		System.out.println("¿Salió aprobado?: " + resultado);		
		System.out.println("¿Saldrá con sus amigos? " + salidaAmigos);		
	}
}
