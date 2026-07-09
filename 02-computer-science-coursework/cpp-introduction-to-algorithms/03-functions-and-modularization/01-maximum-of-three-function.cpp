#include <iostream>

using namespace std;

int MayorNumero(int A, int B, int C) {
    int Max;
    (A >= B && A >= C) ? Max = A : 0;
    (B >= A && B >= C) ? Max = B : 0;
    (C >= A && C >= B) ? Max = C : 0;
    return Max;
}

int main() {
    int A, B, C, Max;
    cout << "Ingresa 3 numeros: ";
    cin >> A >> B >> C;
    Max = MayorNumero(A, B, C);
    cout << "El mayor numero de los 3 ingresados es: " << Max;
    return 0;
}
