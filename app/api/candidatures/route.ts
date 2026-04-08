import { db } from '@/lib/db';
import { candidatures } from '@/lib/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation
    const required = ['nom_complet','telephone','region','ville','niveau'];
    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json(
          { error: `Champ requis: ${field}` },
          { status: 400 }
        );
      }
    }

    // Phone validation Maroc
    const phone = body.telephone.replace(/\s/g, '');
    if (!/^(\+212|00212|0)[5-9]\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // Insert to Neon
    const [result] = await db
      .insert(candidatures)
      .values({
        nomComplet:  body.nom_complet.trim(),
        age:         body.age?.toString() || null,
        telephone:   phone,
        email:       body.email?.trim() || null,
        region:      body.region,
        ville:       body.ville.trim(),
        niveau:      body.niveau,
        motivations: Array.isArray(body.motivations)
                     ? body.motivations.join(', ')
                     : body.motivations || null,
        notes:       body.message?.trim() || null, // Assuming body.message maps to notes
        groupe:      'G06',
      })
      .returning({ id: candidatures.id });

    return NextResponse.json({
      success: true,
      id: result.id
    });

  } catch (err: any) {
    console.error('[CANDIDATURE ERROR]', err.message);
    return NextResponse.json(
      { error: err.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
