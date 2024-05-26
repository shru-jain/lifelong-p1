from django.shortcuts import render, redirect
from django.utils.html import escape
from .models import Document
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from transformers import BartTokenizer, BartForConditionalGeneration


model_name = 'facebook/bart-large-cnn'
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)


class Temp:
    paragraph_content = "A frog is any member of a diverse and largely carnivorous group of short-bodied, tailless amphibians composing the order Anura[1] (coming from the Ancient Greek ἀνούρα, literally 'without tail'). The oldest fossil 'proto-frog' Triadobatrachus is known from the Early Triassic of Madagascar, but molecular clock dating suggests their split from other amphibians may extend further back to the Permian, 265 million years ago. Frogs are widely distributed, ranging from the tropics to subarctic regions, but the greatest concentration of species diversity is in tropical rainforest. Frogs account for around 88% of extant amphibian species. They are also one of the five most diverse vertebrate orders. Warty frog species tend to be called toads, but the distinction between frogs and toads is informal, not from taxonomy or evolutionary history. \nAn adult frog has a stout body, protruding eyes, anteriorly-attached tongue, limbs folded underneath, and no tail (the tail of tailed frogs is an extension of the male cloaca). Frogs have glandular skin, with secretions ranging from distasteful to toxic. Their skin varies in colour from well-camouflaged dappled brown, grey and green to vivid patterns of bright red or yellow and black to show toxicity and ward off predators. Adult frogs live in fresh water and on dry land; some species are adapted for living underground or in trees. \nFrogs typically lay their eggs in water. The eggs hatch into aquatic larvae called tadpoles that have tails and internal gills. They have highly specialized rasping mouth parts suitable for herbivorous, omnivorous or planktivorous diets. The life cycle is completed when they metamorphose into adults. A few species deposit eggs on land or bypass the tadpole stage. Adult frogs generally have a carnivorous diet consisting of small invertebrates, but omnivorous species exist and a few feed on plant matter. Frog skin has a rich microbiome which is important to their health. Frogs are extremely efficient at converting what they eat into body mass. They are an important food source for predators and part of the food web dynamics of many of the world's ecosystems. The skin is semi-permeable, making them susceptible to dehydration, so they either live in moist places or have special adaptations to deal with dry habitats. Frogs produce a wide range of vocalizations, particularly in their breeding season, and exhibit many different kinds of complex behaviors to attract mates, to fend off predators and to generally survive."

def editor(request):
    docid = int(request.GET.get('docid', 0))
    quote = str(request.GET.get('quote', ''))
    documents = Document.objects.all()

    if request.method == 'POST':
        docid = int(request.POST.get('docid', 0))
        title = request.POST.get('title', 'No title')
        content = request.POST.get('content', '')
        quote = request.POST.get('quote', '')

        if title == "":
            title = "No Title"
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


@csrf_exempt
def summarize_text(request):
    if request.method == 'POST':
        import json
        data = json.loads(request.body)
        text = data.get('text', '')

        # Tokenize and summarize the text
        inputs = tokenizer.encode("summarize: " + text, return_tensors='pt', max_length=1024, truncation=True)
        summary_ids = model.generate(inputs, max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return JsonResponse({'summary': summary})
    return JsonResponse({'error': 'Invalid request method'}, status=400)




def update_paragraph(request):
    if request.method == 'POST':
        t.paragraph_content = request.POST.get('new_paragraph_content')
        # Update the paragraph content in the context
        context = request.session.get('context', {})
        context['paragraph'] = escape(t.paragraph_content)
        # return render(request, 'editor.html', context)
        return HttpResponse(render(request, 'editor.html', context), content_type='text/html')

t = Temp()