---
layout: post
title:  "Ch04-22-break&continue"
---
# break문과 continue문 예제
```java
import java.util.*;

class Ex4_21_practice {
	public static void main(String[] args) { 
		//제시된 3개의 메뉴 중 하나를 선택하게 하는 코드.
		
		int num = 0;
		Scanner scanner = new Scanner(System.in);
		
		while(true) {
			System.out.println("1. square");
			System.out.println("2. square root");
			System.out.println("3. log");
			System.out.println("원하는 메뉴를 선택해 주세요. (종료:0)");
			num = scanner.nextInt();
			
			if (num ==0) {
				System.out.println("시스템을 종료합니다");
				 break;
			} else if (!(1 <= num && num <= 3)) {
				System.out.println("잘못 입력하셨습니다. 다시 입력해주세요.");
				continue;
			}
			System.out.println("선택하신 메뉴는 "+num+"번 입니다.");
		}
	}
}
```

# 피드백  
(1) 전체적인 틀을 구상해보자. 


while과 continue를 이용해야된다고 지시가 내려졌다면 일단 세부적인 건 뒤로하고(1~3 사이 입력하면 이런 문구를, 만약 1~3 숫자 입력이 되지 않으면 이런 문구를 넣어야겠다 라는 생각)


1. 조건식을 설정하기에 앞서 조건과 상관없이 계속해서 반복 출력되어야 하는 코드 생각  
    = 메뉴 제시, 메뉴선택요청하는 문구 출력 + 사용자가 입력하는 숫자 입력받는 코드  
    ```java
    		while(true) {
			System.out.println("1. square");
			System.out.println("2. square root");
			System.out.println("3. log");
			System.out.println("원하는 메뉴를 선택해 주세요. (종료:0)");
			num = scanner.nextInt();
      ```
    
    
2. 반복문의 기본 출력값을 정하고, 특정 조건에서 그 기본 출력값을 건너뛰게 하는 것이 continue.  


    (1) 기본 출력값: 대다수의 사용자가 입력할 것으로 예상되는 값 => 1,2,3  
    그 값으로 인한 출력 문구 
    ```java
    System.out.println("선택하신 메뉴는 "+num+"번 입니다.");
    ```
    
    (2) continue: 그 외의 값(=> 1, 2, 3 을 제외한 모든 수)을 입력할 때 출력할 문구 + 기본값 문구 스킵
    ```java
    else if (!(1 <= num && num <= 3)) {
				System.out.println("잘못 입력하셨습니다. 다시 입력해주세요.");
				continue;
    ```
    
    (3) 0을 선택하는 경우 => 모든 반복문이 실행될 필요가 없으므로 break.
