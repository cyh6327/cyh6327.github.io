---
layout: post
title: Markdown and HTML
---

Jekyll supports the use of [Markdown](http://daringfireball.net/projects/markdown/syntax) with inline HTML tags which makes it easier to quickly write posts with Jekyll, without having to worry too much about text formatting. A sample of the formatting follows.

Tables have also been extended from Markdown:

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

Here's an example of an image, which is included using Markdown:

![Geometric pattern with fading gradient]({{ site.baseurl }}/assets/img/sample_feature_img_2.png)

Highlighting for code in Jekyll is done using Pygments or Rouge. This theme makes use of Rouge by default.

{% highlight js %}
// count to ten
for (var i = 1; i <= 10; i++) {
    console.log(i);
}

// count to twenty
var j = 0;
while (j < 20) {
    j++;
    console.log(j);
}
{% endhighlight %}

```java
if(!local_book_key.isEmpty()) {
    Map<String,Object> bookInfo = integratebookMapper.getBookInfo2(Long.parseLong(local_book_key));
    if(bookInfo != null) {
        String workingStatus = String.valueOf(bookInfo.get("WORKING_STATUS"));
        if(!workingStatus.equals("BOL112N")) {
            resultObject.put("status", "WARNING");
            resultObject.put("statusDescription", "비치 상태가 아닌 자료는 발송이 불가합니다.");
            resultObject.put("statusCode", "LILL_K02_LOC_B01_03_SERVICE_0006");
            return resultObject;
        }
    }
}
```

Type Theme uses KaTeX to display maths. Equations such as $$S_n = a \times \frac{1-r^n}{1-r}$$ can be displayed inline.

Alternatively, they can be shown on a new line:

$$ f(x) = \int \frac{2x^2+4x+6}{x-2} $$
