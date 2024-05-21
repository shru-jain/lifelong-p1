from django.shortcuts import render, redirect
from django.utils.html import escape
from .models import Document
from django.http import HttpResponse

class Temp:
    paragraph_content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ante metus dictum at tempor commodo. Risus feugiat in ante metus dictum at tempor commodo. Tortor at auctor urna nunc id cursus metus aliquam. Donec ultrices tincidunt arcu non sodales. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta non. Augue eget arcu dictum varius duis at. Quis risus sed vulputate odio ut. At erat pellentesque adipiscing commodo elit at imperdiet dui. Sed felis eget velit aliquet sagittis id consectetur purus ut. Integer feugiat scelerisque varius morbi enim nunc faucibus a. Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit. Justo laoreet sit amet cursus sit amet dictum sit. Sed faucibus turpis in eu mi bibendum neque egestas."
    
def editor(request):
    docid = int(request.GET.get('docid', 0))
    quote = str(request.GET.get('quote'))
    documents = Document.objects.all()

    if request.method == 'POST':
        docid = int(request.POST.get('docid', 0))
        title = request.POST.get('title')
        content = request.POST.get('content', '')
        quote = request.POST.get('quote', '')

        if docid > 0:
            document = Document.objects.get(pk=docid)
            document.title = title
            document.content = content
            document.quote = quote
            document.save()

            return redirect('/?docid=%i' % docid)
        else:
            document = Document.objects.create(title=title, content=content, quote=quote)

            return redirect('/?docid=%i' % document.id)

    if docid > 0:
        document = Document.objects.get(pk=docid)
    else:
        document = ''

    context = {
        'docid': docid,
        'documents': documents,
        'document': document,
        'paragraph': t.paragraph_content
    }
    if quote is not None:
        context['quote'] = quote
    return render(request, 'editor.html', context)

def delete_document(request, docid):
    document = Document.objects.get(pk=docid)
    document.delete()

    return redirect('/?docid=0')


def update_paragraph(request):
    if request.method == 'POST':
        t.paragraph_content = request.POST.get('new_paragraph_content')
        # Update the paragraph content in the context
        context = request.session.get('context', {})
        context['paragraph'] = escape(t.paragraph_content)
        # return render(request, 'editor.html', context)
        return HttpResponse(render(request, 'editor.html', context), content_type='text/html')

t = Temp()