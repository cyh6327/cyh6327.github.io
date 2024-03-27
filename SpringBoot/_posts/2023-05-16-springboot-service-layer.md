---
title:  "[SpringBoot] #10 서비스 계층과 DTO + 게시판 목록 구현"
categories: 
    - SpringBoot
date: 2023-05-16
last_modified_at: 2023-05-18
---

# [Spring Boot] #10 서비스 계층과 DTO + 게시판 목록 구현

## 1. 서비스 계층과 DTO
### 1) DTO와 엔티티의 분리
- JPA를 이용하게 되면 엔티티 객체는 단순히 데이터를 담는 객체가 아니라 실제 데이터베이스와 관련이 있고, 내부적으로 엔티티 매니저가 관리하는 객체임. <br>
=> 일회성으로 데이터를 주고받는 용도로 사용되는 DTO를 사용함으로써 분리 필요.

### 2) DTO 사용의 장/단점
1. 장점
- 엔티티 객체의 범위를 한정 지을 수 있기 때문에 좀 더 안전한 코드 작성 가능.
- 화면과 데이터를 분리하려는 취지에도 좀 더 부합함.

2. 단점
- 엔티티와 유사한 코드를 중복으로 개발한다는 점.
- 엔티티 객체를 DTO로 변환하거나 반대로 DTO객체를 엔티티로 변환하는 과정이 필요하다는 것.

### 3) DTO 추가
- getter/setter를 통해 자유롭게 값을 변경할 수 있도록 구성.

```java
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class GuestbookDTO {
    
    private long gno;
    private String title;
    private String content;
    private String writer;
    private LocalDateTime regDate, modDate;
    
}
```

### 4) 서비스 계층 추가
```java
public interface GuestbookService {
    Long register(GuestbookDTO dto);
}
```

```java
@Service
@Log4j2
public class GuestbookServiceImpl implements GuestbookService {
    @Override
    public Long register(GuestbookDTO dto) {
        return null;
    }
}
```


## 2. 등록과 DTO를 엔티티로 변환하기
- 서비스 계층에서는 파라미터를 DTO 타입으로 받기 때문에 이를 JPA로 처리하기 위해서는 엔티티 타입의 객체로 변환해야 하는 작업이 반드시 필요.<br>
방법: 1. 기능을 DTO 클래스에 적용 2. ModelMapper라이브러리 3. MapStruct

### 1) `default` 메서드
- 정의: Java8 이후부터 인터페이스의 실제 내용을 가지는 코드를 `default`라는 키워드로 생성 가능.
- 이를 통해 '인터페이스 -> 추상 클래스 -> 구현 클래스' 의 형태로 구현되던 방식에서 추상 클래스를 생략하는 것이 가능해짐.

### 2) `default` 메서드 활용하여 DTO -> 엔티티 변환

```java
public interface GuestbookService {
    Long register(GuestbookDTO dto);

    default Guestbook dtoToEntity(GuestbookDTO dto) {
        Guestbook entity = Guestbook.builder()
                .gno(dto.getGno())
                .title(dto.getTitle())
                .content(dto.getContent())
                .writer(dto.getWriter())
                .build();
        return entity;
    }
}
```

```java
@Service
@Log4j2
public class GuestbookServiceImpl implements GuestbookService {
    @Override
    public Long register(GuestbookDTO dto) {

        log.info("DTO---------------------------------------");
        log.info(dto);

        Guestbook entity = dtoToEntity(dto);

        log.info(entity);

        return null;
    }
}
```

- 테스트 코드
```java
@SpringBootTest
public class GuestbookServiceTests {

    @Autowired
    private GuestbookService service;

    @Test
    public void testRegister() {

        GuestbookDTO guestbookDTO = GuestbookDTO.builder()
                .title("Sample Title...")
                .content("Sample Content...")
                .writer("user0")
                .build();

        System.out.println(service.register(guestbookDTO));
        
    }
}
```

- 실행 결과
![image](https://github.com/cyh6327/Baekjoon/assets/99089584/7443d468-f19b-4cc6-969d-1f2763b7df74) <br>
=> ServiceImpl의 register 메서드가 정상적으로 실행되어 dto객체가 엔티티 객체로 변환된 것 확인. <br>
(첫째줄 DTO 객체, 둘째줄 엔티티 객체)


### 3) ServiceImpl에 적용 및 DB 확인
```java
@Override
public Long register(GuestbookDTO dto) {

    log.info("DTO---------------------------------------");
    log.info(dto);

    Guestbook entity = dtoToEntity(dto);

    log.info(entity);

    // 데이터 db 저장
    repository.save(entity);

    return entity.getGno();
}
``` 
> gno값이 0으로 고정되는 오류
> - DTO에서 gno타입을 `Long`이 아닌 `long`으로 선언해서 생긴 문제. <br>
> => 일반적으로 Java에서 정수형 변수(int, long)는 값을 할당하지 않을 경우 0으로 초기화(객체 타입 변수는 `null`로 초기화)됨.

- 실행 결과

![image](https://github.com/cyh6327/Baekjoon/assets/99089584/066fc31a-42bb-4db7-8c96-87a6d2029fad)
![image](https://github.com/cyh6327/Baekjoon/assets/99089584/6b411da5-ad3c-4642-b9f2-8cb3ae5406b0)



## 3. 목록 처리 세팅
### 1) PageRequestDTO
- 목록 페이지를 요청할 때 사용하는 데이터를 재사용하기 쉽게 만드는 클래스.
- 페이지 처리 관련 파라미터를 DTO로 선언하고 나중에 재사용하는 용도.

```java
@Builder
@AllArgsConstructor
@Data
public class PageRequestDTO {

    private int page;
    private int size;

    public PageRequestDTO() {
        this.page = 1;
        this.size = 10;
    }

    public Pageable getPageable(Sort sort) {
        // JPA를 이용하는 경우 페이지 번호가 0부터 시작한다는 점을 감안하여 page: -1
        return PageRequest.of(page -1, size, sort);
    }

}
```

### 2) PageResultDTO
- JPA를 이용하는 Repository에서는 페이지 처리 결과를 `Page<Entity>` 타입으로 반환하기 때문에 별도의 클래스를 만들어서 처리해야 함.<br>
=> `Page<Entity>`의 엔티티 객체들을 DTO 객체로 변환(`Function<EN, DTO> fn` 이용)해서 자료구조로 담아 주는 것.
- 어떤 종류의 `Page<E>` 타입이 생성되더라도 `PageResultDTO`를 이용해서 처리할 수 있음.
```java
@Data
// 다양한 곳에서 사용할 수 있도록 제네릭 타입을 이용해 DTO와 EN이라는 타입을 지정.
public class PageResultDTO<DTO, EN> {
    
    private List<DTO> dtoList;
    
    public PageResultDTO(Page<EN> result, Function<EN, DTO> fn) {
        dtoList = result.stream().map(fn).collect(Collectors.toList());
    }
}
```


### 3) 목록 처리를 위한 서비스 계층 메서드 추가
1. `getList()` : <br>
`PageRequestDTO`를 파라미터로, `PageResultDTO`를 리턴 타입으로 사용하는 설계.
2. `entityToDto()` : <br>
엔티티 객체를 DTO 객체로 변환.

```java
//GuestbookService
PageResultDTO<GuestbookDTO, Guestbook> getList(PageRequestDTO requestDTO);

default GuestbookDTO entityToDto(Guestbook entity) {
    GuestbookDTO dto = GuestbookDTO.builder()
            .gno(entity.getGno())
            .title(entity.getTitle())
            .content(entity.getContent())
            .writer(entity.getWriter())
            .regDate(entity.getRegdate())
            .modDate(entity.getModDate())
            .build();
    return dto;
}
```

```java
//GuestbookServiceImpl
@Override
public PageResultDTO<GuestbookDTO, Guestbook> getList(PageRequestDTO requestDTO) {
    Pageable pageable = requestDTO.getPageable(Sort.by("gno").descending());

    Page<Guestbook> result = repository.findAll(pageable);

    Function<Guestbook, GuestbookDTO> fn = (entity -> entityToDto(entity));

    //JPA의 처리 결과인 Page<Entity>와 Function을 전달해서 엔티티 객체들을 DTO의 리스트로 변환
    return new PageResultDTO<>(result, fn);
}
```


### 4) 목록 처리 테스트
- 테스트 코드 작성

```java
@Test
public void testList() {
    PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(1).size(10).build();

    PageResultDTO<GuestbookDTO, Guestbook> resultDTO = service.getList(pageRequestDTO);

    for(GuestbookDTO guestbookDTO : resultDTO.getDtoList()) {
        System.out.println(guestbookDTO);
    }
}
```

- 실행 결과
![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/4209f47e-1781-4775-a3f3-e1539443a00d) 
<br>
=> `Page<Guestbook>`이 `List<GuestBookDTO>`로 정상적으로 변환된 것 확인.


### 5) 목록 데이터 페이지 처리
- 페이징 변수 선언, 할당 및 페이징 메서드 `makePageList()` 구현

```java
@Data
public class PageResultDTO<DTO, EN> {

    private List<DTO> dtoList;
    
    private int totalPage;
    private int page;
    private int size;
    private int start, end;
    private boolean prev, next;
    private List<Integer> pageList;

    public PageResultDTO(Page<EN> result, Function<EN, DTO> fn) {
        dtoList = result.stream().map(fn).collect(Collectors.toList());
        
        totalPage = result.getTotalPages();
        makePageList(result.getPageable());
    }

    private void makePageList(Pageable pageable) {
        this.page = pageable.getPageNumber() + 1; //0부터 시작하므로 1을 추가
        this.size = pageable.getPageSize();
        
        int tempEnd = (int)(Math.ceil(page/10.0)) * 10;
        start = tempEnd - 9;
        prev = start > 1;
        //마지막 페이지가 33이라면 위의 tempEnd 계산대로라면 40이 되기 때문에 이를 반영하기 위해 totalPage 이용
        end = totalPage > tempEnd ? tempEnd : totalPage;
        next = totalPage > tempEnd;
        
        pageList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());
    }
}
```

- 테스트 코드(기존 `testList()`에 추가)

```java
@Test
public void testList() {
    PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(1).size(10).build();

    PageResultDTO<GuestbookDTO, Guestbook> resultDTO = service.getList(pageRequestDTO);

    // boolean형으로 변수 선언시 해당 변수에 대한 getter메서드는 'is' 접두사가 결합되어 자동 생성됨.
    System.out.println("PREV: " + resultDTO.isPrev());
    System.out.println("NEXT: " + resultDTO.isNext());
    System.out.println("TOTAL: " + resultDTO.getTotalPage());
    System.out.println("==========================================");

    for(GuestbookDTO guestbookDTO : resultDTO.getDtoList()) {
        System.out.println(guestbookDTO);
    }

    System.out.println("-----------------------------------------------");
    resultDTO.getPageList().forEach(i -> System.out.println(i));
}
```

- 실행 결과

![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/c01e8db0-8ca6-4225-8637-ea75becadab6)

![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/0b5fbb65-e14b-4d27-9464-c9337aa3a949)
<br>
=> 실제 화면상에서 출력되어야 하는 페이지의 번호.

- 페이지를 14로 설정했을 때 <br>

`PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(14).size(10).build();`

![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/98abecee-6c24-4ec1-b7bb-12c8014855a7)

![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/74df6cb1-9b6b-475c-9dee-9ece62bcbaa8)



## 4. 컨트롤러와 화면에서의 목록 처리
### 1) 컨트롤러
```java
@Controller
@RequestMapping("/guestbook")
@Log4j2
@RequiredArgsConstructor    //자동 주입을 위한 Annotation
public class GuestbookController {
    
    private final GuestbookService service;
    
    @GetMapping("/")
    public String index() {
        return "redirect:/guestbook/list";
    }

    //화면에서 page와 size 파라미터를 전달하면 PageRequestDTO 객체로 자동으로 수집될 것
    @GetMapping("/list")
    public void list(PageRequestDTO pageRequestDTO, Model model) {
        log.info("list.............." + pageRequestDTO);
        model.addAttribute("result", service.getList(pageRequestDTO));
    }

}
```

### 2) list.html
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">

<th:block th:replace="~{/layout/basic :: setContent(~{this::content} )}">

    <th:block th:fragment="content">
        <h1 class="mt-4">GuestBook List Page</h1>

        <table class="table table-striped">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">GNO</th>
                <th scope="col">Title</th>
                <th scope="col">Regdate</th>
            </tr>
            </thead>
            <tbody>
            <tr th:each="dto : ${result.dtoList}">
                <th scope="row">[[${dto.gno}]]</th>
                <td>[[${dto.title}]]</td>
                <td>[[${dto.writer}]]</td>
                <td>[[${#temporals.format(dto.regDate, 'yyyy/MM/dd')}]]</td>
            </tr>
            </tbody>
        </table>

        <ul class="pagination h-100 justify-content-center align-items-center">
            <li class="page-item" th:if="${result.prev}">
                <!-- page= ${result.start -1} 을 해줌으로써 만약 현재 25페이지라면 start=21인데, 이전 버튼 누르면
                page의 start 21-1=20이 되면서 20페이지 볼 수 있음 -->
                <a class="page-link" th:href="@{/guestbook/list(page= ${result.start -1})}" tabindex="-1">Previous</a>
            </li>

            <li th:class=" 'page-item ' + ${result.page == page?'active':''} " th:each="page: ${result.pageList}">
                <a class="page-link" th:href="@{/guestbook/list(page = ${page})}">
                    [[${page}]]
                </a>
            </li>

            <li class="page-item" th:if="${result.next}">
                <a class="page-link" th:href="@{/guestbook/list(page= ${result.end +1})}">Next</a>
            </li>
        </ul>
    </th:block>

</th:block>
```

### 3) 실행 결과
![image](https://github.com/cyh6327/cyh6327.github.io/assets/99089584/b05b2947-39b7-4fe1-889d-89e05572e040)








