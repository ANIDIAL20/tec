import { db } from '@/lib/db';
import { candidatures } from '@/lib/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation des champs requis
    const required = ['nom', 'age', 'telephone', 'region', 'ville', 'niveau'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Champ requis: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validation du numéro de téléphone (Maroc)
    const phone = body.telephone.replace(/\s/g,'');
    if (!/^(\+212|00212|0)[5-9]\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // Insertion en base de données
    const [candidature] = await db
      .insert(candidatures)
      .values({
        nomComplet: body.nom.trim(),
        age:        body.age.toString(),
        telephone:  phone,
        email:      body.email?.trim() || null,
        region:     body.region,
        ville:      body.ville.trim(),
        niveau:     body.niveau,
        motivations: body.motivations || null,
        notes:      body.notes || null,
        groupe:     'G06',
      })
      .returning();

    return NextResponse.json({ 
      success: true, 
      id: candidature.id 
    });

  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la soumission' },
      { status: 500 }
    );
  }
}

// GET — Liste des candidatures (Protégé)
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await db
      .select()
      .from(candidatures)
      .orderBy(candidatures.createdAt);

    return NextResponse.json(data);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}
